'use client';

import {
  BUDGET_LABELS,
  BUDGET_OPTIONS,
  buildLeadSchema,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  LEAD_LIMITS,
  serviceList,
  toFieldErrors,
  type CreateLeadInput,
  type LeadFieldErrors,
  type Locale,
  type ServiceType,
} from '@mandaito/shared';
import { CircleCheck, LoaderCircle, Lock, X } from 'lucide-react';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from 'react';
import { submitLead } from '@/app/actions';
import type { Dictionary } from '@/i18n';
import { WhatsAppIcon } from './icons';
import { LogoMark } from './logo';
import { WhatsAppText } from './whatsapp-text';

type FormValues = Required<Omit<CreateLeadInput, 'budget'>> & { budget: string };

const fieldClass =
  'w-full rounded-xl border border-line-2 bg-surface-2 px-3.5 text-[15px] text-fg placeholder:text-fg-faint transition-colors focus:border-brand-soft focus:outline-none aria-[invalid=true]:border-danger';

export function RequestDialog({
  lang,
  copy: t,
  open,
  initialService,
  whatsappNumber,
  onClose,
}: {
  lang: Locale;
  copy: Dictionary['request'];
  open: boolean;
  initialService: ServiceType;
  whatsappNumber: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const [values, setValues] = useState<FormValues>({
    service: initialService,
    name: '',
    contact: '',
    title: '',
    description: '',
    budget: '',
  });
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [formMessage, setFormMessage] = useState<string>();
  const [doneUrl, setDoneUrl] = useState<string>();
  const [pending, startTransition] = useTransition();
  const schema = useMemo(() => buildLeadSchema(lang), [lang]);

  // Sincroniza el estado de React con el <dialog> nativo (foco, Esc y backdrop accesibles).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const update = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const payload = (): CreateLeadInput => ({
    ...values,
    budget: (values.budget || undefined) as CreateLeadInput['budget'],
  });

  const preview = buildWhatsAppMessage({ ...values, budget: values.budget || undefined }, lang);

  const focusFirstError = (fieldErrors: LeadFieldErrors) => {
    const first = Object.keys(fieldErrors)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
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
        const result = await submitLead({ ...payload(), website }, lang);
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

      setDoneUrl(url);
      if (popup) popup.location.href = url;
      else window.location.href = url;
    });
  };

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
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[980px] overflow-hidden rounded-3xl border border-line-2 bg-surface-3 p-0 text-fg shadow-[0_30px_80px_var(--shadow-strong),0_0_120px_rgba(249,115,22,0.22)] open:animate-fade-up"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-wrap overflow-y-auto">
        {doneUrl ? (
          <SuccessPanel t={t} url={doneUrl} titleId={`${id}-title`} onClose={onClose} />
        ) : (
          <>
            <form
              ref={formRef}
              noValidate
              onSubmit={handleSubmit}
              className="flex min-w-0 flex-[1_1_500px] flex-col gap-5 p-6 sm:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] text-brand-soft uppercase">
                    {t.eyebrow}
                  </p>
                  <h2
                    id={`${id}-title`}
                    className="mt-2.5 font-display text-2xl font-bold tracking-tight sm:text-[28px]"
                  >
                    {t.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{t.lead}</p>
                </div>
                <CloseButton label={t.close} onClose={onClose} />
              </div>

              <fieldset className="flex flex-col gap-2.5">
                <legend className="mb-2.5 text-[13px] font-medium text-fg-soft">
                  {t.serviceType}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {serviceList(lang).map((service) => {
                    const selected = values.service === service.id;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => update('service', service.id)}
                        className={
                          selected
                            ? 'h-11 rounded-[10px] border border-brand-soft bg-brand/15 px-4 text-sm font-semibold text-fg'
                            : 'h-11 rounded-[10px] border border-line-2 bg-surface-2 px-4 text-sm font-medium text-fg-soft transition-colors hover:border-line-3 hover:text-fg'
                        }
                      >
                        {service.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="flex flex-wrap gap-4">
                <Field
                  id={`${id}-name`}
                  label={t.name}
                  error={errors.name}
                  className="flex-[1_1_200px]"
                >
                  <input
                    id={`${id}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={LEAD_LIMITS.name.max}
                    placeholder={t.namePlaceholder}
                    value={values.name}
                    onChange={(e) => update('name', e.target.value)}
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
                    name="contact"
                    type="text"
                    autoComplete="email"
                    maxLength={LEAD_LIMITS.contact.max}
                    placeholder={t.contactPlaceholder}
                    value={values.contact}
                    onChange={(e) => update('contact', e.target.value)}
                    aria-invalid={Boolean(errors.contact)}
                    aria-describedby={errors.contact ? `${id}-contact-error` : undefined}
                    className={`${fieldClass} h-12`}
                  />
                </Field>
              </div>

              <Field id={`${id}-title-input`} label={t.projectTitle} error={errors.title}>
                <input
                  id={`${id}-title-input`}
                  name="title"
                  type="text"
                  maxLength={LEAD_LIMITS.title.max}
                  placeholder={t.projectTitlePlaceholder}
                  value={values.title}
                  onChange={(e) => update('title', e.target.value)}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? `${id}-title-input-error` : undefined}
                  className={`${fieldClass} h-12`}
                />
              </Field>

              <Field id={`${id}-description`} label={t.description} error={errors.description}>
                <textarea
                  id={`${id}-description`}
                  name="description"
                  rows={4}
                  maxLength={LEAD_LIMITS.description.max}
                  placeholder={t.descriptionPlaceholder}
                  value={values.description}
                  onChange={(e) => update('description', e.target.value)}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? `${id}-description-error` : undefined}
                  className={`${fieldClass} resize-y py-3 leading-normal`}
                />
              </Field>

              <Field
                id={`${id}-budget`}
                label={t.budget}
                optional={t.optional}
                error={errors.budget}
              >
                <select
                  id={`${id}-budget`}
                  name="budget"
                  value={values.budget}
                  onChange={(e) => update('budget', e.target.value)}
                  className={`${fieldClass} h-12`}
                >
                  <option value="">{t.budgetPlaceholder}</option>
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {BUDGET_LABELS[lang][option]}
                    </option>
                  ))}
                </select>
              </Field>

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

              <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3.5">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-13 items-center gap-2.5 rounded-xl bg-whatsapp px-6 text-base font-semibold text-whatsapp-ink transition hover:-translate-y-px hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
                >
                  {pending ? (
                    <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <WhatsAppIcon className="size-5" />
                  )}
                  {pending ? t.sending : t.send}
                </button>
                <span className="inline-flex items-center gap-2 text-[13px] text-fg-muted">
                  <Lock className="size-4" aria-hidden="true" />
                  {t.privacy}
                </span>
              </div>
            </form>

            <aside
              aria-label={t.previewLabel}
              className="hidden min-w-0 flex-[1_1_340px] flex-col gap-5 border-l border-line bg-ink-2 p-9 md:flex"
            >
              <p className="text-[13px] font-medium text-fg-soft">{t.previewLabel}</p>
              <div className="overflow-hidden rounded-2xl border border-line bg-chat-bg">
                <div className="flex items-center gap-3 border-b border-chat-line bg-chat-header px-4 py-3.5">
                  <span className="flex size-9.5 items-center justify-center rounded-full bg-[#0a0b14]">
                    <LogoMark id="chat-preview" size={24} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-chat-fg">Mandaito Tech</span>
                    <span className="text-xs text-chat-meta">{t.businessAccount}</span>
                  </span>
                </div>
                <div className="flex flex-col items-end px-4 pt-5 pb-6">
                  <div className="max-w-full rounded-[14px_14px_4px_14px] bg-chat-bubble px-3.5 py-3 text-sm leading-relaxed break-words whitespace-pre-line text-chat-fg shadow-[0_1px_1px_rgb(0_0_0/0.08)]">
                    <WhatsAppText text={preview} />
                  </div>
                  <span className="mt-1.5 text-[11px] text-chat-meta">{t.sentTo}</span>
                </div>
              </div>
              <ol className="flex flex-col gap-3.5">
                {t.steps.map((step, index) => (
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
      className="flex size-11 flex-none items-center justify-center rounded-xl border border-line-2 bg-tint/4 text-fg-soft transition-colors hover:bg-tint/8 hover:text-fg"
    >
      <X className="size-4.5" aria-hidden="true" />
    </button>
  );
}

function SuccessPanel({
  t,
  url,
  titleId,
  onClose,
}: {
  t: Dictionary['request'];
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
        {t.doneTitle}
      </h2>
      <p className="max-w-md text-[15px] leading-relaxed text-fg-muted">{t.doneText}</p>
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
          className="h-13 rounded-xl border border-line-3 bg-tint/5 px-6 font-semibold text-fg transition-colors hover:bg-tint/10"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
