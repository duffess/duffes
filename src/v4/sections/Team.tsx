import { useEffect, useRef, useState } from 'react';
import '@fontsource/great-vibes/latin-400.css';
import { Signature } from '../brand/Signature';
import { useT } from '../brand/lang';

const people = [
  {
    name: 'Isabela',
    photo: '/isabela',
    alt: ['Retrato da Isabela, de óculos e cabelo longo', 'Portrait of Isabela, with glasses and long hair'],
  },
  { name: 'Guilherme', photo: '/guilherme', alt: ['Retrato do Guilherme, de óculos', 'Portrait of Guilherme, with glasses'] },
] as const;

/**
 * Quem assina: as duas pessoas por trás da LYSS.
 * Cada retrato ganha o nome escrito à mão embaixo, como foto autografada.
 */
export function Team() {
  const root = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const t = useT();

  useEffect(() => {
    if (!root.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className={`team${inView ? ' is-in' : ''}`} id="quem-assina" ref={root} aria-labelledby="team-title">
      <div className="team__copy">
        <p className="kicker">{t('Quem assina', 'Who signs it')}</p>
        <h2 id="team-title" className="team__title">
          {t('Duas pessoas, uma assinatura.', 'Two people, one signature.')}
        </h2>
        <p>
          {t(
            'A LYSS é uma dupla. Você fala direto com quem desenha e programa o seu site, sem atendente no meio e sem modelo pronto.',
            'LYSS is a duo. You talk directly to the people who design and build your site, no middleman and no template.',
          )}
        </p>
        <p>
          {t(
            'Cada site sai daqui com uma assinatura: a nossa promessa de que ele abre rápido, funciona no celular e leva o cliente até você.',
            'Every site leaves here signed: our promise that it loads fast, works on mobile and brings customers to you.',
          )}
        </p>
        <Signature className="team__sig" label={t('Assinatura LYSS', 'LYSS signature')} />
      </div>
      <ul className="team__people">
        {people.map((p) => (
          <li key={p.name} className="person">
            <figure>
              <img
                src={`${p.photo}.webp`}
                srcSet={`${p.photo}-480.webp 480w, ${p.photo}.webp 800w`}
                sizes="(max-width: 760px) 46vw, 22vw"
                width={800}
                height={1000}
                alt={t(p.alt[0], p.alt[1])}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="person__name">{p.name}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
