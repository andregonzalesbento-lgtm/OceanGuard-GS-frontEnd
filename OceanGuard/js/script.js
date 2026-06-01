const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 24px rgba(0, 198, 212, 0.08)';
    navbar.style.background = 'rgba(5, 14, 29, 0.97)';
  } else {
    navbar.style.boxShadow = 'none';
    navbar.style.background = '#050e1d';
  }
});

const hamburger = document.createElement('button');
hamburger.className = 'nav-hamburger';
hamburger.setAttribute('aria-label', 'Abrir menu');
hamburger.innerHTML = `
  <span></span>
  <span></span>
  <span></span>
`;
navbar.appendChild(hamburger);

const hamburgerStyle = document.createElement('style');
hamburgerStyle.textContent = `
  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    z-index: 200;
  }
  .nav-hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background-color: #eef4ff;
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .nav-hamburger.aberto span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .nav-hamburger.aberto span:nth-child(2) {
    opacity: 0;
  }
  .nav-hamburger.aberto span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
  @media (max-width: 900px) {
    .nav-hamburger { display: flex; }
    .nav-links.menu-aberto {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 64px;
      left: 0;
      width: 100%;
      background: #050e1d;
      padding: 20px 24px;
      gap: 18px;
      border-bottom: 1px solid #0f2041;
    }
  }
`;
document.head.appendChild(hamburgerStyle);

hamburger.addEventListener('click', () => {
  const aberto = hamburger.classList.toggle('aberto');
  navLinks.classList.toggle('menu-aberto', aberto);
  hamburger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('aberto');
    navLinks.classList.remove('menu-aberto');
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const alvo = document.querySelector(link.getAttribute('href'));
    if (!alvo) return;
    e.preventDefault();
    const alturaNav = navbar.offsetHeight;
    const posicao = alvo.getBoundingClientRect().top + window.scrollY - alturaNav - 12;
    window.scrollTo({ top: posicao, behavior: 'smooth' });
  });
});

const animStyle = document.createElement('style');
animStyle.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .fade-in.visivel {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(animStyle);

const elementosAnimaveis = document.querySelectorAll(
  '.tech-card, .obj-card, .beneficio-card, .perfil-card, ' +
  '.fluxo-card, .lista-item, .stat-card, .badge, .publico-extra'
);

elementosAnimaveis.forEach((el, i) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${(i % 6) * 80}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

elementosAnimaveis.forEach(el => observer.observe(el));

function animarContador(elemento, valorFinal, duracao = 1800) {
  const textoOriginal = elemento.textContent.trim();
  const sufixo = textoOriginal.replace(/[\d]/g, '');
  const inicio = performance.now();

  function atualizar(agora) {
    const progresso = Math.min((agora - inicio) / duracao, 1);
    const fator = 1 - Math.pow(1 - progresso, 3);
    const atual = Math.round(fator * valorFinal);
    elemento.textContent = atual + sufixo;
    if (progresso < 1) requestAnimationFrame(atualizar);
  }
  requestAnimationFrame(atualizar);
}

const statNums = document.querySelectorAll('.stat-numero');
const valoresStats = [80, 0, 103];

const contadorObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...statNums].indexOf(entry.target);
        animarContador(entry.target, valoresStats[idx] ?? 0);
        contadorObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach(el => contadorObserver.observe(el));

const celularBotao = document.querySelector('.celular-botao');
const celularOffline = document.querySelector('.celular-offline');

if (celularBotao && celularOffline) {
  const offlineTexto = celularOffline.querySelector('p');

  celularBotao.addEventListener('click', () => {
    celularBotao.textContent = '⏳ Enviando relato…';
    celularBotao.disabled = true;
    celularBotao.style.opacity = '0.7';

    setTimeout(() => {
      celularBotao.textContent = '✅ Relato enviado!';
      celularBotao.style.opacity = '1';
      if (offlineTexto) {
        offlineTexto.textContent = 'Relato registrado com sucesso — satélite confirmou.';
      }

      setTimeout(() => {
        celularBotao.textContent = '+ Novo relato';
        celularBotao.disabled = false;
        if (offlineTexto) {
          offlineTexto.textContent = 'Relato salvo, Obrigado, enviará quando tiver sinal';
        }
      }, 3000);
    }, 1500);
  });
}

const secoes = document.querySelectorAll('section[id]');
const linksNav = document.querySelectorAll('.nav-links a[href^="#"]');

const secaoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        linksNav.forEach(link => {
          const ativo = link.getAttribute('href') === `#${id}`;
          link.style.color = ativo ? 'var(--ciano)' : '';
          link.style.fontWeight = ativo ? '700' : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

secoes.forEach(s => secaoObserver.observe(s));

const pontoPiscando = document.querySelector('.ponto-piscando');
if (pontoPiscando) {
  const pulsoStyle = document.createElement('style');
  pulsoStyle.textContent = `
    @keyframes pulso {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.3; transform: scale(0.6); }
    }
    .ponto-piscando {
      animation: pulso 1.4s ease-in-out infinite;
    }
  `;
  document.head.appendChild(pulsoStyle);
}
