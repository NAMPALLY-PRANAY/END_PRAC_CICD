pipeline {
    agent any

    environment {
        REGISTRY = "docker.io"                        // Docker Hub registry
        IMAGE_NAME = "2310030224/react-app"          // Docker Hub repo
        DOCKER_CREDENTIALS = "dockerhub-creds"       // Jenkins Docker Hub credential ID
        KUBECONFIG_CREDENTIALS = "kubeconfig"        // Jenkins kubeconfig file credential ID
        BUILD_TAG = "v${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.withRegistry("https://${REGISTRY}", DOCKER_CREDENTIALS) {
                        def img = docker.build("${IMAGE_NAME}:${BUILD_TAG}")
                        img.push()
                        img.push("latest")       // Optional: Latest tag
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: KUBECONFIG_CREDENTIALS, variable: 'KCFG')]) {
                    sh '''
                        mkdir -p $HOME/.kube
                        cp $KCFG $HOME/.kube/config
                        chmod 600 $HOME/.kube/config

                        # Update deployment image
                        kubectl set image deployment/react-app react-app=${IMAGE_NAME}:${BUILD_TAG} --namespace default || true

                        # Apply manifest files (if changed)
                        kubectl apply -f deployment.yaml
                        kubectl apply -f service.yaml

                        # Wait for rollout
                        kubectl rollout status deployment/react-app --timeout=90s
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "SUCCESS: Build + Deploy Completed. Image: ${IMAGE_NAME}:${BUILD_TAG}"
        }
        failure {
            echo "FAILURE: Pipeline Failed."
        }
    }
}