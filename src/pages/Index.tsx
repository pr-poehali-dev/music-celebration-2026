import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type Slide = 1 | 2 | 3 | 4 | 5;

const TRACKS: Record<Slide, string> = {
  1: "https://files.catbox.moe/hpmw1f.mp3",
  2: "https://files.catbox.moe/lwrp1s.mp3",
  3: "https://files.catbox.moe/me270d.mp3",
  4: "https://files.catbox.moe/dfrqfp.mp3",
  5: "https://files.catbox.moe/n1spvd.mp3",
};

function Fireflies() {
  const flies = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div className="fireflies-container" aria-hidden="true">
      {flies.map((i) => (
        <div
          key={i}
          className="firefly"
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            animationDelay: `${(i * 0.31) % 8}s`,
            animationDuration: `${6 + (i % 6)}s`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function Index() {
  const [slide, setSlide] = useState<Slide>(1);
  const [transitioning, setTransitioning] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [visible, setVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
    };
  }, []);

  const playTrack = (trackNum: Slide) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.pause();
    audio.src = TRACKS[trackNum];
    audio.load();
    audio.volume = 0.65;
    const tryPlay = () => {
      audio.play().catch(() => {});
      audio.removeEventListener("canplay", tryPlay);
    };
    audio.addEventListener("canplay", tryPlay);
  };

  const stopTrack = () => {
    audioRef.current?.pause();
  };

  const goTo = (next: Slide, stopMusic = false) => {
    if (transitioning) return;
    setTransitioning(true);
    setVisible(false);
    setTimeout(() => {
      setSlide(next);
      setVisible(true);
      setTransitioning(false);
      if (stopMusic) stopTrack();
      else playTrack(next);
    }, 600);
  };

  const handleStart = () => {
    setMusicStarted(true);
    playTrack(1);
  };

  return (
    <div className="spotira-root">
      <Fireflies />
      <div className={`slide-wrapper ${visible ? "slide-in" : "slide-out"}`}>
        {slide === 1 && (
          <SlideOne
            musicStarted={musicStarted}
            onStart={handleStart}
            onNext={() => goTo(2)}
          />
        )}
        {slide === 2 && <SlideTwo onNext={() => goTo(3)} />}
        {slide === 3 && <SlideThree onNext={() => goTo(4)} />}
        {slide === 4 && <SlideFour onNext={() => goTo(5)} />}
        {slide === 5 && <SlideFive />}
      </div>
    </div>
  );
}

function SlideOne({
  musicStarted,
  onStart,
  onNext,
}: {
  musicStarted: boolean;
  onStart: () => void;
  onNext: () => void;
}) {
  return (
    <div className="slide slide-one">
      <div className="logo-wrap">
        <span className="logo-spot">spot</span>
        <span className="logo-ira">IRA</span>
      </div>
      <div className="year-badge">2026</div>
      <div className="slide-one-center">
        <p className="slide-one-tagline">
          не просто музыкальные итоги —<br />
          а приглашение отметить мои 30
        </p>
        <p className="slide-one-sub">Привет, Виктория. Это для тебя 💛</p>
      </div>
      <div className="slide-one-btns">
        {!musicStarted ? (
          <button className="btn-primary" onClick={onStart}>
            <Icon name="Play" size={18} />
            Нажми сюда
          </button>
        ) : (
          <button className="btn-ghost" onClick={onNext}>
            Смотреть итоги
            <Icon name="ChevronRight" size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

function SlideTwo({ onNext }: { onNext: () => void }) {
  return (
    <div className="slide slide-two">
      <div className="track-label">Трек, что связывает нас с тобой</div>
      <div className="vinyl-wrap">
        <div className="vinyl-disk">
          <div className="vinyl-inner" />
        </div>
      </div>
      <p className="slide-text">
        Родились в Саратове, сейчас живём в Санкт-Петербурге, а первый раз
        встретились в Сеуле. Кажется, буква С нас преследует?
        <br />
        <br />
        Я так рада, что мы знакомы с тобой — ты луч среди этих туч. Давай
        дальше создавать общие воспоминания 🌤
      </p>
      <button className="btn-ghost" onClick={onNext}>
        Далее
        <Icon name="ChevronRight" size={18} />
      </button>
    </div>
  );
}

function SlideThree({ onNext }: { onNext: () => void }) {
  return (
    <div className="slide slide-three">
      <div className="track-label">Световая волна следа</div>
      <div className="wave-bg" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="wave-bar"
            style={{
              animationDelay: `${i * 0.12}s`,
              height: `${30 + Math.abs(Math.sin(i * 0.8)) * 30}px`,
            }}
          />
        ))}
      </div>
      <h2 className="slide-title">Момент с тобой</h2>
      <p className="slide-text">
        Помнишь, как ты выключала мой будильник в Сеуле, когда я его не
        слышала?
        <br />
        <br />А как горела глазами, чтобы показать мне новый сериал про
        хоккеистов?
        <br />
        <br />
        Спасибо тебе за эти моменты 🏒✨
      </p>
      <button className="btn-ghost" onClick={onNext}>
        Что там дальше?
        <Icon name="ChevronRight" size={18} />
      </button>
    </div>
  );
}

function SlideFour({ onNext }: { onNext: () => void }) {
  const stats = [
    { label: "Сколько мы дружим", value: "2421 день" },
    { label: "Сколько раз ты была на моём дне рождения", value: "1 раз" },
    {
      label: "Как сильно я дорожу тобой",
      value: "так долго, сколько живут энты",
    },
  ];

  return (
    <div className="slide slide-four">
      <div className="track-label">Трек, что ассоциируется с тобой</div>
      <div className="stats-list">
        {stats.map((s, i) => (
          <div
            key={i}
            className="stat-item"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <span className="stat-label">{s.label}</span>
            <span className="stat-value">{s.value}</span>
          </div>
        ))}
      </div>
      <p className="slide-text" style={{ marginTop: "2rem" }}>
        Я хочу разделить с тобой свои 30 лет и переход в новое десятилетие 🎂
      </p>
      <button className="btn-primary" onClick={onNext}>
        Подробности
        <Icon name="ChevronRight" size={18} />
      </button>
    </div>
  );
}

function SlideFive() {
  const program = [
    { time: "17.30 – 18.30", desc: "Сбор, лёгкий перекус, первые тосты" },
    {
      time: "18.30 – 20.30",
      desc: "Вкусно кушаем, вкусно пьём и проходим квиз по Иришке",
    },
    { time: "20.30 – 22.00", desc: "Слушаем музыку, общаемся" },
  ];

  return (
    <div className="slide slide-five">
      <div className="invite-badge">Приглашение</div>
      <h2 className="invite-title">Жду тебя</h2>
      <div className="invite-date">27 июня · 17.30</div>
      <div className="invite-address">
        Московский проспект 139А
        <br />
        м Электросила
        <br />
        <span className="invite-hint">
          вход с торца здания через железную калитку
        </span>
      </div>
      <div className="invite-phone">Мой номер знаешь!</div>
      <div className="invite-theme">
        Тематика праздника:{" "}
        <a
          href="https://docs.google.com/document/d/19nD4DwoFk2GaUhR5G1j0_YAmeqTiTXoMtmebOjLU_JA/edit?tab=t.0"
          target="_blank"
          rel="noopener noreferrer"
          className="invite-eurovision"
        >
          Eurovision
        </a>
      </div>
      <p className="invite-click-hint">нажми, чтобы узнать подробности</p>

      <div className="program">
        <div className="program-title">Что тебя ждёт?</div>
        {program.map((p, i) => (
          <div key={i} className="program-item">
            <span className="program-time">{p.time}</span>
            <span className="program-desc">{p.desc}</span>
          </div>
        ))}
      </div>

      <div className="invite-btns">
        <a
          href="https://docs.google.com/document/d/19nD4DwoFk2GaUhR5G1j0_YAmeqTiTXoMtmebOjLU_JA/edit?tab=t.0"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Подробности о вечере
          <Icon name="ExternalLink" size={16} />
        </a>
        <a
          href="https://docs.google.com/spreadsheets/d/1Ku3rdanulnFMoDGRRYnycAnj4sJThtFrm7mCLC-oufE/edit?gid=0#gid=0"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          Wishlist
          <Icon name="Gift" size={16} />
        </a>
      </div>
    </div>
  );
}