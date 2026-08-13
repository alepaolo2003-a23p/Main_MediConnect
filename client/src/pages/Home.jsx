import { Link, Navigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { HOME_BY_ROLE } from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import "./Home.scss";

const FEATURES = [
  {
    icon: "👥",
    title: "Profesionales",
    text: "Médicos altamente calificados",
  },
  {
    icon: "🛡️",
    title: "Seguridad",
    text: "Tu información está protegida",
  },
  {
    icon: "🕒",
    title: "Atención",
    text: "Horarios flexibles que se adaptan a ti",
  },
];

const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Contacto", href: "#contacto" },
];

export function Home() {
  const { isAuthenticated, checkingSession, user } = useAuth();

  // Si ya hay sesión activa, saltar la landing e ir directo al dashboard.
  if (!checkingSession && isAuthenticated) {
    return <Navigate to={HOME_BY_ROLE[user.rol] || "/login"} replace />;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <Logo size={30} />

        <nav className="home-nav">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <Link to="/login" className="home-header__cta">
          Iniciar Sesión
        </Link>
      </header>

      <section className="home-hero" id="inicio">
        <div className="home-hero__content">
          <span className="home-hero__badge">BIENVENIDO</span>
          <h1>
            Tu salud es <span>nuestra prioridad</span>
          </h1>
          <p>
            En MediConnect contamos con profesionales especializados y
            tecnología moderna para brindarte la mejor atención médica.
          </p>

          <div className="home-hero__actions">
            <Link to="/login" className="btn-primary">
              📅 Reservar Cita
            </Link>
            <a href="#nosotros" className="btn-outline">
              Conocer más
            </a>
          </div>

          <div className="home-features">
            {FEATURES.map((f) => (
              <div className="home-features__card" key={f.title}>
                <span className="home-features__icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-hero__visual">
          <div className="home-hero__visual-card">
            <Logo size={26} variant="light" />
          </div>
        </div>
      </section>

      <section className="home-section" id="servicios">
        <h2>Nuestros servicios</h2>
        <div className="home-section__grid">
          <div className="home-section__card">
            <span>🩺</span>
            <h3>Consultas médicas</h3>
            <p>Agenda citas con especialistas en distintas áreas de salud.</p>
          </div>
          <div className="home-section__card">
            <span>📋</span>
            <h3>Historial clínico</h3>
            <p>Accede a tu historial y notas médicas desde cualquier lugar.</p>
          </div>
          <div className="home-section__card">
            <span>🏥</span>
            <h3>Clínicas afiliadas</h3>
            <p>Elige entre nuestra red de clínicas asociadas.</p>
          </div>
        </div>
      </section>

      <section className="home-section home-section--alt" id="nosotros">
        <h2>Sobre nosotros</h2>
        <p>
          MediConnect nace para simplificar la manera en que pacientes,
          médicos y administradores gestionan citas, historiales y clínicas
          desde una sola plataforma, segura y fácil de usar.
        </p>
      </section>

      <footer className="home-footer" id="contacto">
        <Logo size={26} variant="light" />
        <p>© {new Date().getFullYear()} MediConnect. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
