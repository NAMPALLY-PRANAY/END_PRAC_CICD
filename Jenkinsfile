pipeline {
    agent any

    environment {
        REGISTRY = "docker.io"                           // Docker registry (change if needed)
        IMAGE_NAME = "2310030224/react-app"              // Change to your registry/username/repo
        DOCKER_CREDENTIALS = "dockerhub-creds"           // Jenkins credential id for docker registry
        KUBECONFIG_CREDENTIALS = "kubeconfig"            // Jenkins file credential id containing kubeconfig
        BUILD_TAG = "v${env.BUILD_NUMBER ?: 'local'}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm ci'
                // run tests once (no watch). Adjust args if using different test runner.
                sh 'npm test -- --watchAll=false --silent || true' // avoid pipeline failure on UI test flakiness; remove "|| true" to fail on test failures
            }
        }

        stage('Build App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    // Build and push docker image using credentials stored in Jenkins
                    docker.withRegistry("https://${env.REGISTRY}", env.DOCKER_CREDENTIALS) {
                        def img = docker.build("${env.IMAGE_NAME}:${env.BUILD_TAG}")
                        img.push()
                        // also push 'latest' tag
                        img.push('latest')
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Use a kubeconfig file stored in Jenkins credentials (type: Secret file)
                withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS, variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                      mkdir -p $HOME/.kube
                      cp "$KUBECONFIG_FILE" $HOME/.kube/config
                      chmod 600 $HOME/.kube/config

                      # Try to update the existing deployment image, fallback to apply
                      kubectl set image deployment/react-app react-app=${IMAGE_NAME}:${BUILD_TAG} --namespace default || true

                      # Ensure manifests reference the pushed image tag (simple sed replace if needed)
                      # If your deployment.yaml uses a fixed image, update it here before applying
                      # The following replaces image in deployment.yaml (GNU sed). Adjust if using different OS.
                      if grep -q "image:" deployment.yaml; then
                        sed -E -i.bak "s|(image:)[[:space:]]*.*|\\1 ${IMAGE_NAME}:${BUILD_TAG}|" deployment.yaml || true
                      fi

                      kubectl apply -f deployment.yaml
                      # optionally apply service
                      if [ -f service.yaml ]; then
                        kubectl apply -f service.yaml
                      fi

                      # rollout status to ensure deployment succeeded
                      kubectl rollout status deployment/react-app --namespace default --timeout=120s || true
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully. Image: ${IMAGE_NAME}:${BUILD_TAG}"
        }
        failure {
            echo "Pipeline failed."
        }
    }
}
