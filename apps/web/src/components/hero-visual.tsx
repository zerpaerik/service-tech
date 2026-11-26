import { Check, ShoppingBag } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { getDictionary, type Locale } from '@/i18n';
import { LogoMark } from './logo';

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

/**
 * Animación decorativa del hero, en bucle de 12 s: un cliente escribe por WhatsApp,
 * construimos su tienda y queda publicada. Siempre en el tema oscuro.
 * Los tiempos y las escenas viven en globals.css (.hero-stage, .hero-pop…).
 */
export function HeroVisual({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).heroVisual;
  return (
    <div aria-hidden="true" className="relative w-full min-w-0 flex-[1_1_440px] pt-4">
      <div data-theme="dark" className="relative mx-1 h-[380px] text-fg sm:mx-5 sm:h-[420px]">
        {/* Escena 1: el cliente escribe por WhatsApp */}
        <div className="hero-stage absolute inset-0">
          <div className="absolute inset-0 overflow-hidden rounded-[20px] border border-chat-line bg-chat-bg shadow-[0_40px_80px_rgba(0,0,0,0.45),0_0_80px_rgba(37,211,102,0.12)]">
            <div className="flex items-center gap-3 border-b border-chat-line bg-chat-header px-4.5 py-3.5">
              <span className="flex size-9.5 items-center justify-center rounded-full bg-[#0a0b14]">
                <LogoMark id="hero-chat" size={24} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">Mandaito Tech</span>
                <span className="text-xs text-chat-meta">{t.online}</span>
              </span>
            </div>
            <div className="flex flex-col gap-3 px-4.5 py-5.5 text-sm leading-normal">
              <Bubble from="customer" at={0.4}>
                {t.customer1}
              </Bubble>
              <Bubble from="customer" at={1.3}>
                {t.customer2}
              </Bubble>
              <div
                className="hero-pop flex gap-1.5 self-start rounded-[14px_14px_14px_4px] bg-[#1a2c27] px-4 py-3.5"
                style={delay(2.1)}
              >
                <span className="typing-dot size-1.75 rounded-full bg-chat-meta" />
                <span className="typing-dot size-1.75 rounded-full bg-chat-meta" />
                <span className="typing-dot size-1.75 rounded-full bg-chat-meta" />
              </div>
              <Bubble from="us" at={2.9}>
                {t.reply}
              </Bubble>
            </div>
          </div>
        </div>

        {/* Escena 2: construimos la tienda */}
        <div className="hero-stage absolute inset-0" style={delay(4)}>
          <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-line-2 bg-linear-to-b from-[#171a2b] to-[#0d0f1c] shadow-[0_40px_80px_rgba(0,0,0,0.45),0_0_80px_rgba(249,115,22,0.28)]">
            <WindowBar>
              <span className="ml-3 font-mono text-xs text-fg-faint">{t.fileName}</span>
            </WindowBar>
            <div className="flex flex-col p-5.5 font-mono text-[13px] leading-[1.9] sm:text-sm">
              <CodeLine at={4.3} className="text-fg-faint">
                {t.comment}
              </CodeLine>
              <CodeLine at={4.8}>
                <span className="text-brand-soft">const</span> {t.store} = mandaito.
                <span className="text-code-key">{t.create}</span>({'{'}
              </CodeLine>
              <CodeLine at={5.3}>
                {'  '}
                {t.catalog}: <span className="text-accent">&quot;{t.catalogValue}&quot;</span>,
              </CodeLine>
              <CodeLine at={5.8}>
                {'  '}
                {t.payments}: <span className="text-accent">&quot;{t.paymentsValue}&quot;</span>,
              </CodeLine>
              <CodeLine at={6.3}>
                {'  '}
                {t.mobile}: <span className="text-brand-soft">true</span>,
              </CodeLine>
              <CodeLine at={6.8}>{'});'}</CodeLine>
            </div>
            <div className="absolute right-5.5 bottom-6.5 left-5.5">
              <div className="mb-2 flex justify-between text-xs text-fg-muted">
                <span>{t.building}</span>
                <span>{t.stage}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div className="hero-bar h-full rounded-full bg-linear-to-r from-brand to-accent" />
              </div>
            </div>
          </div>
        </div>

        {/* Escena 3: la tienda publicada (también la imagen fija sin animaciones) */}
        <div className="hero-stage hero-stage-final absolute inset-0" style={delay(8)}>
          <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-line-2 bg-surface shadow-[0_40px_80px_rgba(0,0,0,0.45),0_0_80px_rgba(34,211,238,0.2)]">
            <WindowBar>
              <span className="ml-3 flex h-6.5 flex-1 items-center rounded-lg bg-ink px-3 text-xs text-fg-muted">
                {t.url}
              </span>
            </WindowBar>
            <div className="flex flex-col gap-3.5 p-5">
              <div className="flex h-23 items-center rounded-xl bg-linear-to-r from-brand/35 to-accent/25 px-5 font-display text-xl font-bold">
                {t.banner}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['$24', '$39', '$18'].map((price, index) => (
                  <div key={price} className="rounded-[10px] bg-surface-2 p-2.5">
                    <div className="h-17.5 rounded-lg bg-[#1f2338]" />
                    <div
                      className="mt-2 h-2 rounded bg-line-3"
                      style={{ width: `${[70, 60, 75][index]}%` }}
                    />
                    <div className="mt-1.5 text-xs font-semibold text-brand-soft">{price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Toast
            at={8.6}
            className="-top-4.5 right-0"
            iconClass="bg-emerald-400/15 text-emerald-400"
            icon={<Check className="size-4.5" strokeWidth={2.4} />}
            title={t.published}
            subtitle={t.publishedSub}
          />
          <Toast
            at={9.4}
            className="-bottom-4.5 left-0"
            iconClass="bg-brand/15 text-brand-soft"
            icon={<ShoppingBag className="size-4.5" />}
            title={t.order}
            subtitle={t.orderSub}
          />
        </div>
      </div>

      <ol className="mx-1 mt-9 grid grid-cols-3 gap-2.5 sm:mx-5">
        {t.steps.map((step, index) => (
          <li
            key={step}
            className="hero-step rounded-xl border border-line-2 bg-tint/3 px-2 py-2.5 text-center text-xs font-semibold text-fg-faint sm:text-[13px]"
            style={delay(index * 4)}
          >
            {index + 1} · {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function WindowBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-line px-4.5 py-3.5">
      <span className="size-2.75 rounded-full bg-[#3a3f5c]" />
      <span className="size-2.75 rounded-full bg-[#3a3f5c]" />
      <span className="size-2.75 rounded-full bg-[#3a3f5c]" />
      {children}
    </div>
  );
}

function Bubble({
  from,
  at,
  children,
}: {
  from: 'customer' | 'us';
  at: number;
  children: ReactNode;
}) {
  return (
    <div
      className={`hero-pop max-w-[80%] px-3.5 py-2.5 text-chat-fg ${
        from === 'customer'
          ? 'self-end rounded-[14px_14px_4px_14px] bg-chat-bubble'
          : 'self-start rounded-[14px_14px_14px_4px] bg-[#1a2c27]'
      }`}
      style={delay(at)}
    >
      {children}
    </div>
  );
}

function CodeLine({
  at,
  className = '',
  children,
}: {
  at: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={`hero-pop whitespace-pre ${className}`} style={delay(at)}>
      {children}
    </span>
  );
}

function Toast({
  at,
  className,
  iconClass,
  icon,
  title,
  subtitle,
}: {
  at: number;
  className: string;
  iconClass: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className={`hero-pop absolute flex items-center gap-3 rounded-[14px] border border-line-2 bg-surface/94 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-md ${className}`}
      style={delay(at)}
    >
      <span className={`flex size-8.5 items-center justify-center rounded-[10px] ${iconClass}`}>
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-[13px] font-semibold">{title}</span>
        <span className="text-xs text-fg-muted">{subtitle}</span>
      </span>
    </div>
  );
}
