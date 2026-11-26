'use client';

import {
  buildLeadSchema,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  CALL_MODES,
  LEAD_LIMITS,
  serviceList,
  toFieldErrors,
  type CallMode,
  type CreateLeadInput,
  type LeadFieldErrors,
  type Locale,
  type ServiceType,
} from '@mandaito/shared';
import { CalendarDays, CircleCheck, LoaderCircle, X } from 'lucide-react';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { submitLead } from '@/app/actions';
import type { Dictionary } from '@/i18n';
import { track } from '@/lib/analytics';
import { getSource } from '@/lib/attribution';
import { CALL_HOURS, displayHour, upcomingCallDays, type CallDay } from '@/lib/schedule';
import { WhatsAppIcon } from './icons';
import { LogoMark } from './logo';
import { WhatsAppText } from './whatsapp-text';

export type RequestMode = 'request' | 'call';

type Copy = Dictionary['request'];

const fieldClass =
  'w-full rounded-xl border border-line-2 bg-surface-2 px-3.5 text-[15px] text-fg placeholder:text-fg-faint transition-colors focus:border-brand-soft focus:outline-none aria-[invalid=true]:border-danger';

const chipBase = 'cursor-pointer border font-semibold transition-colors';
const chipOn = 'border-brand-soft bg-brand/15 text-fg';
const chipOff = 'border-line-2 bg-surface-2 text-fg-soft hover:border-line-3 hover:text-fg';
const chip = (selected: boolean) => `${chipBase} ${selected ? chipOn : chipOff}`;

export function RequestDialog({
  lang,
  copy: t,
  open,
  initialService,
  initialMode,
  initialIdea,
  whatsappNumber,
  onClose,
}: {
  lang: Locale;
  copy: Copy;
  open: boolean;
  initialService: ServiceType;
  initialMode: RequestMode;
  initialIdea?: string;
  whatsappNumber: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const [mode, setMode] = useState<RequestMode>(initialMode);
  const [service, setService] = useState<ServiceType>(initialService);
  const [idea, setIdea] = useState<string | undefined>(initialIdea);
  const [details, setDetails] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [callMode, setCallMode] = useState<CallMode>('VIDEO');
  const [pickedDate, setCallDate] = useState<string>();
  const [callTime, setCallTime] = useState('10:00');
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [formMessage, setFormMessage] = useState<string>();
  const [done, setDone] = useState<{ url: string; mode: RequestMode }>();
  const [pending, startTransition] = useTransition();
  const schema = useMemo(() => buildLeadSchema(lang), [lang]);
  const isCall = mode === 'call';

  // Las fechas dependen del día de hoy: solo se calculan con el formulario abierto
  // (en el navegador), nunca al generar la página estática.
  const days = useMemo<CallDay[]>(() => (open ? upcomingCallDays(lang) : []), [open, lang]);
  const callDate = pickedDate ?? days[0]?.value;

  // Sincroniza el estado de React con el <dialog> nativo (foco, Esc y backdrop accesibles).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const clearError = (field: keyof LeadFieldErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const payload = (): CreateLeadInput =>
    isCall
      ? { kind: 'CALL', service, name, contact, callMode, callDate, callTime, locale: lang }
      : {
          kind: 'REQUEST',
          service,
          name,
          contact,
          title: idea,
          description: details,
          locale: lang,
        };

  const preview = buildWhatsAppMessage(
    isCall
      ? { kind: 'CALL', service, name, contact, callMode, callDate, callTime }
      : { kind: 'REQUEST', service, name, contact, title: idea, description: details },
    lang,
  );

  const focusFirstError = (fieldErrors: LeadFieldErrors) => {
    const first = Object.keys(fieldErrors)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage(undefined);

    const parsed = schema.safeParse(payload());
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      focusFirstError(fieldErrors);
      return;
    }

    // Abrimos la pestaña ya (dentro del clic) para que el navegador no la bloquee.
    const popup = window.open('', '_blank');
    if (popup) popup.opener = null;

    startTransition(async () => {
      let url: string;
      try {
        const result = await submitLead({ ...payload(), website, source: getSource() }, lang);
        if (!result.ok) {
          popup?.close();
          setErrors(result.errors);
          setFormMessage(result.message);
          focusFirstError(result.errors);
          return;
        }
        url = result.whatsappUrl;
      } catch {
        // Sin conexión con el servidor: igual abrimos WhatsApp con el mensaje.
        url = buildWhatsAppUrl(whatsappNumber, preview);
      }

      track({ name: 'lead', kind: isCall ? 'CALL' : 'REQUEST', service });
      setDone({ url, mode });
      if (popup) popup.location.href = url;
      else window.location.href = url;
    });
  };

  const switchMode = (next: RequestMode) => {
    setMode(next);
    setErrors({});
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next: RequestMode = mode === 'request' ? 'call' : 'request';
    switchMode(next);
    event.currentTarget.parentElement?.querySelector<HTMLElement>(`[data-tab="${next}"]`)?.focus();
  };

  const selectedDay = days.find((day) => day.value === callDate);

  return (
    // El clic en el fondo cierra el modal; con teclado, el <dialog> nativo ya se cierra con Esc.
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby={`${id}-title`}
      className="m-auto max-h-[calc(100dvh-1rem)] w-[calc(100%-1rem)] max-w-[1040px] sm:max-h-[calc(100dvh-2rem)] sm:w-[calc(100%-2rem)] overflow-hidden rounded-3xl border border-line-2 bg-surface-3 p-0 text-fg shadow-[0_30px_80px_var(--shadow-strong),0_0_120px_rgba(249,115,22,0.2)] open:animate-fade-up"
    >
      <div className="flex max-h-[calc(100dvh-1rem)] flex-wrap overflow-y-auto sm:max-h-[calc(100dvh-2rem)]">
        {done ? (
          <SuccessPanel
            title={done.mode === 'call' ? t.doneCallTitle : t.doneTitle}
            text={done.mode === 'call' ? t.doneCallText : t.doneText}
            t={t}
            url={done.url}
            titleId={`${id}-title`}
            onClose={onClose}
          />
        ) : (
          <>
            <form
              ref={formRef}
              noValidate
              onSubmit={handleSubmit}
              className="flex min-w-0 flex-[1_1_540px] flex-col gap-4.5 p-5 pb-0 sm:p-8 sm:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id={`${id}-title`}
                    className="font-display text-2xl font-bold tracking-tight sm:text-[26px]"
                  >
                    {t.title}
                  </h2>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-fg-muted">{t.lead}</p>
                </div>
                <CloseButton label={t.close} onClose={onClose} />
              </div>

              <div
                role="tablist"
                aria-label={t.tabsLabel}
                className="grid grid-cols-2 gap-1.5 rounded-2xl border border-line bg-ink-2 p-1.5"
              >
                {(['request', 'call'] as const).map((tab) => {
                  const selected = mode === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      data-tab={tab}
                      id={`${id}-tab-${tab}`}
                      aria-selected={selected}
                      aria-controls={`${id}-panel`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => switchMode(tab)}
                      onKeyDown={onTabKey}
                      className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] px-2 text-sm font-semibold whitespace-nowrap sm:h-12 transition-colors sm:text-[15px] ${
                        selected ? 'bg-brand text-on-brand' : 'text-fg-soft hover:text-fg'
                      }`}
                    >
                      {tab === 'request' ? (
                        <WhatsAppIcon className="hidden size-4.5 sm:block" />
                      ) : (
                        <CalendarDays className="hidden size-4.5 sm:block" aria-hidden="true" />
                      )}
                      {tab === 'request' ? t.tabRequest : t.tabCall}
                    </button>
                  );
                })}
              </div>

              <div
                id={`${id}-panel`}
                role="tabpanel"
                aria-labelledby={`${id}-tab-${mode}`}
                className="flex flex-col gap-5"
              >
                <ChoiceGroup legend={isCall ? t.callTopic : t.serviceType} error={errors.service}>
                  {serviceList(lang).map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      data-field={index === 0 ? 'service' : undefined}
                      aria-pressed={service === item.id}
                      onClick={() => {
                        if (item.id !== service) setIdea(undefined);
                        setService(item.id);
                        clearError('service');
                      }}
                      className={`h-11 rounded-[10px] px-4 text-sm ${chip(service === item.id)}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </ChoiceGroup>

                {isCall ? (
                  <>
                    <ChoiceGroup legend={t.callMode} error={errors.callMode} grid="grid-cols-3">
                      {CALL_MODES.map((option, index) => (
                        <button
                          key={option}
                          type="button"
                          data-field={index === 0 ? 'callMode' : undefined}
                          aria-pressed={callMode === option}
                          onClick={() => {
                            setCallMode(option);
                            clearError('callMode');
                          }}
                          className={`flex min-h-14 flex-col items-start justify-center gap-0.5 rounded-xl px-2.5 py-2 text-left sm:min-h-15 sm:px-3.5 sm:py-2.5 ${chip(callMode === option)}`}
                        >
                          <span className="text-[13px] leading-tight sm:text-sm">
                            {t.modes[option].label}
                          </span>
                          <span className="hidden text-xs font-normal text-fg-muted sm:block">
                            {t.modes[option].hint}
                          </span>
                        </button>
                      ))}
                    </ChoiceGroup>

                    <ChoiceGroup legend={t.day} error={errors.callDate} grid="grid-cols-5">
                      {days.map((day, index) => (
                        <button
                          key={day.value}
                          type="button"
                          data-field={index === 0 ? 'callDate' : undefined}
                          aria-pressed={callDate === day.value}
                          aria-label={day.long}
                          onClick={() => {
                            setCallDate(day.value);
                            clearError('callDate');
                          }}
                          className={`flex h-16 flex-col items-center justify-center gap-0.5 rounded-xl ${chip(callDate === day.value)}`}
                        >
                          <span className="text-[11px] font-medium tracking-[0.08em] uppercase sm:text-xs">
                            {day.weekday}
                          </span>
                          <span className="font-display text-lg sm:text-xl">{day.day}</span>
                        </button>
                      ))}
                    </ChoiceGroup>

                    <ChoiceGroup
                      legend={t.time}
                      hint={`· ${t.timeZone}`}
                      error={errors.callTime}
                      grid="grid-cols-4"
                    >
                      {CALL_HOURS.map((hour, index) => (
                        <button
                          key={hour}
                          type="button"
                          data-field={index === 0 ? 'callTime' : undefined}
                          aria-pressed={callTime === hour}
                          onClick={() => {
                            setCallTime(hour);
                            clearError('callTime');
                          }}
                          className={`h-11 rounded-[10px] text-sm ${chip(callTime === hour)}`}
                        >
                          {displayHour(hour)}
                        </button>
                      ))}
                    </ChoiceGroup>
                  </>
                ) : (
                  <>
                    <ChoiceGroup legend={t.need} hint={t.needHint} error={errors.title}>
                      {t.ideas[service].map((option, index) => (
                        <button
                          key={option}
                          type="button"
                          data-field={index === 0 ? 'title' : undefined}
                          aria-pressed={idea === option}
                          onClick={() => {
                            setIdea(idea === option ? undefined : option);
                            clearError('title');
                          }}
                          className={`h-10 rounded-full px-3.5 text-sm font-medium ${chip(idea === option)}`}
                        >
                          {option}
                        </button>
                      ))}
                    </ChoiceGroup>

                    <Field
                      id={`${id}-details`}
                      label={t.details}
                      optional={t.optional}
                      error={errors.description}
                    >
                      <textarea
                        id={`${id}-details`}
                        data-field="description"
                        rows={2}
                        maxLength={LEAD_LIMITS.description.max}
                        placeholder={t.detailsPlaceholder}
                        value={details}
                        onChange={(e) => {
                          setDetails(e.target.value);
                          clearError('title');
                          clearError('description');
                        }}
                        aria-invalid={Boolean(errors.description)}
                        className={`${fieldClass} resize-y py-3 leading-normal`}
                      />
                    </Field>
                  </>
                )}

                <div className="flex flex-wrap gap-4">
                  <Field
                    id={`${id}-name`}
                    label={t.name}
                    error={errors.name}
                    className="flex-[1_1_200px]"
                  >
                    <input
                      id={`${id}-name`}
                      data-field="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={LEAD_LIMITS.name.max}
                      placeholder={t.namePlaceholder}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearError('name');
                      }}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? `${id}-name-error` : undefined}
                      className={`${fieldClass} h-12`}
                    />
                  </Field>
                  <Field
                    id={`${id}-contact`}
                    label={t.contact}
                    optional={t.optional}
                    error={errors.contact}
                    className="flex-[1_1_200px]"
                  >
                    <input
                      id={`${id}-contact`}
                      data-field="contact"
                      name="contact"
                      type="text"
                      autoComplete="email"
                      maxLength={LEAD_LIMITS.contact.max}
                      placeholder={t.contactPlaceholder}
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                        clearError('contact');
                      }}
                      aria-invalid={Boolean(errors.contact)}
                      aria-describedby={errors.contact ? `${id}-contact-error` : undefined}
                      className={`${fieldClass} h-12`}
                    />
                  </Field>
                </div>
              </div>

              {/* Campo trampa para bots: oculto para personas y lectores de pantalla. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={`${id}-website`}>{t.honeypot}</label>
                <input
                  id={`${id}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {formMessage ? (
                <p
                  role="alert"
                  className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
                >
                  {formMessage}
                </p>
              ) : null}

              {/* Siempre visible al fondo del formulario mientras se completa. */}
              <div className="sticky bottom-0 z-10 -mx-5 mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line bg-surface-3/95 px-5 pt-3.5 pb-5 backdrop-blur-md sm:-mx-8 sm:px-8 sm:pb-8">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-whatsapp px-6 text-base font-semibold text-whatsapp-ink transition hover:-translate-y-px hover:brightness-105 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                >
                  {pending ? (
                    <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <WhatsAppIcon className="size-5" />
                  )}
                  {pending ? t.sending : isCall ? t.sendCall : t.send}
                </button>
                <span className="text-[13px] text-fg-muted">{t.reassurance}</span>
              </div>
            </form>

            <aside
              aria-label={t.previewLabel}
              className="hidden min-w-0 flex-[1_1_340px] flex-col gap-5 border-l border-line bg-ink-2 p-8 md:flex"
            >
              {isCall && selectedDay ? (
                <div className="flex items-center gap-3.5 rounded-2xl border border-line-2 bg-surface p-4">
                  <span className="flex h-14 w-13 flex-none flex-col items-center justify-center rounded-xl bg-brand/15">
                    <span className="text-[11px] font-semibold text-brand-soft uppercase">
                      {selectedDay.weekday}
                    </span>
                    <span className="font-display text-xl font-bold">{selectedDay.day}</span>
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">
                      {t.modes[callMode].label} · {displayHour(callTime)}
                    </span>
                    <span className="text-[13px] text-fg-muted">
                      {selectedDay.long} · {t.summaryZone}
                    </span>
                    <span className="text-[13px] text-fg-muted">{t.summaryConfirm}</span>
                  </span>
                </div>
              ) : null}
              <p className="text-[13px] font-medium text-fg-soft">{t.previewLabel}</p>
              <div className="overflow-hidden rounded-2xl border border-line bg-chat-bg">
                <div className="flex items-center gap-3 border-b border-chat-line bg-chat-header px-4 py-3">
                  <span className="flex size-9.5 items-center justify-center rounded-full bg-[#0a0b14]">
                    <LogoMark id="chat-preview" size={24} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-chat-fg">Mandaito Tech</span>
                    <span className="text-xs text-chat-meta">{t.businessAccount}</span>
                  </span>
                </div>
                <div className="flex flex-col items-end px-4 pt-4.5 pb-5">
                  <div className="max-w-full rounded-[14px_14px_4px_14px] bg-chat-bubble px-3.5 py-3 text-sm leading-relaxed break-words whitespace-pre-line text-chat-fg shadow-[0_1px_1px_rgb(0_0_0/0.08)]">
                    <WhatsAppText text={preview} />
                  </div>
                </div>
              </div>
              <ol className="flex flex-col gap-3">
                {(isCall ? t.callSteps : t.steps).map((step, index) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex size-6.5 flex-none items-center justify-center rounded-full bg-brand/15 text-[13px] font-bold text-brand-soft">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-normal text-fg-soft">{step}</span>
                  </li>
                ))}
              </ol>
            </aside>
          </>
        )}
      </div>
    </dialog>
  );
}

/** Grupo de opciones (botones) con su título y error. */
function ChoiceGroup({
  legend,
  hint,
  error,
  grid,
  children,
}: {
  legend: string;
  hint?: string;
  error?: string;
  /** Clases de grilla; sin ellas, las opciones fluyen en filas. */
  grid?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col border-0 p-0">
      <legend className="mb-2.5 p-0 text-[13px] font-medium text-fg-soft">
        {legend} {hint ? <span className="font-normal text-fg-faint">{hint}</span> : null}
      </legend>
      <div className={grid ? `grid grid-cols-1 gap-2 ${grid}` : 'flex flex-wrap gap-2'}>
        {children}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  className = '',
  children,
}: {
  id: string;
  label: string;
  /** Texto "(opcional)" en el idioma de la página. */
  optional?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-[13px] font-medium text-fg-soft">
        {label} {optional ? <span className="text-fg-faint">{optional}</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CloseButton({ label, onClose }: { label: string; onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-xl border border-line-2 bg-tint/4 text-fg-soft transition-colors hover:bg-tint/8 hover:text-fg"
    >
      <X className="size-4.5" aria-hidden="true" />
    </button>
  );
}

function SuccessPanel({
  t,
  title,
  text,
  url,
  titleId,
  onClose,
}: {
  t: Copy;
  title: string;
  text: string;
  url: string;
  titleId: string;
  onClose: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-5 px-6 py-14 text-center sm:px-12">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-whatsapp/15">
        <CircleCheck className="size-8 text-whatsapp" aria-hidden="true" />
      </span>
      <h2 id={titleId} className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-md text-[15px] leading-relaxed text-fg-muted">{text}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-13 items-center gap-2.5 rounded-xl bg-whatsapp px-6 font-semibold text-whatsapp-ink transition hover:-translate-y-px"
        >
          <WhatsAppIcon className="size-5" />
          {t.openWhatsApp}
        </a>
        <button
          type="button"
          onClick={onClose}
          className="h-13 cursor-pointer rounded-xl border border-line-3 bg-tint/5 px-6 font-semibold text-fg transition-colors hover:bg-tint/10"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
