import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './App.css';

const lessons = [
	{ id: 'basics', title: 'Routing Basics', minutes: 6 },
	{ id: 'params', title: 'Route Params', minutes: 8 },
	{ id: 'navigation', title: 'Programmatic Navigation', minutes: 5 },
	{ id: 'mouse', title: 'Programmatic Navigation', minutes: 5 },
];

function HomePage() {
	return (
		<section className="page-card">
			<h2>Home</h2>
			<p>This is the home route. Use the navigation bar to switch pages instantly.</p>
			<p>
				You can also open a lesson URL directly, for example:
				<code>/lessons/params</code>
			</p>
		</section>
	);
}

function AboutPage() {
	const navigate = useNavigate();

	return (
		<section className="page-card">
			<h2>About</h2>
			<p>
				This route shows how a normal page component works inside <strong>Routes</strong>.
			</p>
			<button type="button" onClick={() => navigate('/lessons')}>
				Go to Lessons (useNavigate)
			</button>
		</section>
	);
}

function LessonsPage() {
	return (
		<section className="page-card">
			<h2>Lessons</h2>
			<p>Click a lesson to open a dynamic route using a URL param.</p>

			<ul className="lesson-list">
				{lessons.map((lesson) => (
					<li key={lesson.id}>
						<Link to={`/lessons/${lesson.id}`}>
							{lesson.title} <span>{lesson.minutes} min</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}

function LessonDetailsPage() {
	const { lessonId } = useParams();
	const lesson = lessons.find((item) => item.id === lessonId);

	if (!lesson) {
		return (
			<section className="page-card">
				<h2>Lesson Not Found</h2>
				<p>No lesson exists for: {lessonId}</p>
				<Link to="/lessons">Back to all lessons</Link>
			</section>
		);
	}

	return (
		<section className="page-card">
			<h2>{lesson.title}</h2>
			<p>
				URL param received: <strong>{lessonId}</strong>
			</p>
			<p>Estimated time: {lesson.minutes} minutes</p>
			<Link to="/lessons">Back to lessons</Link>
		</section>
	);
}

function NotFoundPage() {
	return (
		<section className="page-card">
			<h2>404</h2>
			<p>The page you are trying to open does not exist.</p>
			<Link to="/">Back to home</Link>
		</section>
	);
}

function App() {
	return (
		<main className="router-demo">
			<h1>Simple React Router DOM Example</h1>

			<nav className="router-nav">
				<NavLink to="/" end>
					Home
				</NavLink>
				<NavLink to="/about">About</NavLink>
				<NavLink to="/lessons">Lessons</NavLink>
			</nav>

			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/lessons" element={<LessonsPage />} />
				<Route path="/lessons/:lessonId" element={<LessonDetailsPage />} />
				<Route path="/home" element={<Navigate to="/" replace />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</main>
	);
}

export default App;