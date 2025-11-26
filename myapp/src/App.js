import logo from './logo.svg';
import './App.css';

function App() {
	// Random student data
	const student = {
		name: 'PRANAY',
		age: 19,
		course: 'B.Tech — Computer Science',
		bio: 'Passionate about full‑stack development, open source and competitive programming. Loves teaching peers and building small tools to automate tasks.',
		awards: [
			'First Prize — College Hackathon 2023',
			'Dean\'s List (2022)',
		],
		achievements: [
			'Built a campus attendance app used by 200+ students',
			'Mentored a team to national coding contest finals',
		],
		certifications: [
			'Coursera: Algorithms Specialization',
			'AWS Certified Cloud Practitioner',
		],
		technologiesToShare: [
			'JavaScript (ES6+), React',
			'Node.js, Express',
			'Git & GitHub workflow (PRs, branching)',
			'Basic Docker and container concepts',
			'REST APIs and JSON',
		],
	};

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<h1>Student Blog</h1>

				<article style={{textAlign: 'left', maxWidth: 700, margin: '0 auto', padding: 16}}>
					<h2>{student.name} — {student.course}</h2>
					<p><strong>Age:</strong> {student.age}</p>
					<p>{student.bio}</p>

					<section>
						<h3>Awards</h3>
						<ul>
							{student.awards.map((a, i) => <li key={i}>{a}</li>)}
						</ul>
					</section>

					<section>
						<h3>Achievements</h3>
						<ul>
							{student.achievements.map((a, i) => <li key={i}>{a}</li>)}
						</ul>
					</section>

					<section>
						<h3>Certifications</h3>
						<ul>
							{student.certifications.map((c, i) => <li key={i}>{c}</li>)}
						</ul>
					</section>

					<section>
						<h3>Useful Technologies to Share with Friends</h3>
						<ul>
							{student.technologiesToShare.map((t, i) => <li key={i}>{t}</li>)}
						</ul>
					</section>
				</article>
			</header>
		</div>
	);
}

export default App;
