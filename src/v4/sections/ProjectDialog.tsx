import { useEffect, useRef } from 'react';
import type { Project } from '../brand/projects';
import { waLink } from '../brand/data';
import { useLang, useT } from '../brand/lang';
import { projectText } from '../brand/projects';

type Props = { project: Project | null; shown: boolean; onClose: () => void };

/** O projeto em tela cheia, depois que a câmera mergulha na folha. */
export function ProjectDialog({ project, shown, onClose }: Props) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lang = useLang();
  const t = useT();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && box.current) {
        // o foco fica dentro do projeto enquanto ele está aberto
        const f = box.current.querySelectorAll<HTMLElement>('a[href], button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus({ preventScroll: true });
    };
  }, [project, onClose]);

  useEffect(() => {
    if (shown) closeBtn.current?.focus({ preventScroll: true });
  }, [shown]);

  if (!project) return null;
  return (
    <div
      ref={box}
      className={`project${shown ? ' is-shown' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <div className="project__bar">
        <button ref={closeBtn} className="project__close" type="button" onClick={onClose}>
          <span aria-hidden="true">←</span> {t('Voltar à mesa', 'Back to the desk')}
        </button>
        <p className="project__meta">
          {projectText(project, lang).kind}
          {project.place ? ` · ${project.place}` : ''}
        </p>
      </div>
      <div className="project__inner">
        <h2 id="project-title" className="project__title">
          {project.title}
        </h2>
        <p className="project__desc">{projectText(project, lang).description}</p>
        <figure className="project__shot">
          {project.video ? (
            <video src={project.video} autoPlay muted loop playsInline aria-label={t(`Gravação do site ${project.title}`, `Screen recording of the ${project.title} site`)} />
          ) : (
            <img src={project.image} alt={t(`Primeira tela do site ${project.title}`, `First screen of the ${project.title} site`)} width={1280} height={720} />
          )}
        </figure>
        <ul className="project__details">
          {projectText(project, lang).details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <div className="project__cta">
          <a className="btn" href={project.url} target="_blank" rel="noopener noreferrer">
            {t('Ver o site no ar', 'See the live site')}
            <span className="sr-only">{t(' (abre em outra aba)', ' (opens in a new tab)')}</span>
          </a>
          <a
            className="btn btn--ghost"
            href={waLink(
              t(
                `Olá! Vi o projeto ${project.title} no site da LYSS e quero um site assim.`,
                `Hi! I saw the ${project.title} project on the LYSS site and I want a site like it.`,
              ),
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Quero um assim', 'I want one like this')}
            <span className="sr-only">{t(' (abre o WhatsApp em outra aba)', ' (opens WhatsApp in a new tab)')}</span>
          </a>
        </div>
        <p className="project__url">{project.urlLabel}</p>
      </div>
    </div>
  );
}
