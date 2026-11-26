'use client';

import {
  BUDGET_OPTIONS,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  createLeadSchema,
  LEAD_LIMITS,
  SERVICE_LIST,
  toFieldErrors,
  type CreateLeadInput,
  type LeadFieldErrors,
  type ServiceType,
} from '@mandaito/shared';
import { CircleCheck, LoaderCircle, Lock, X } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from 'react';
import { submitLead } from '@/app/actions';
import { WhatsAppIcon } from './icons';
import { LogoMark } from './logo';
import { WhatsAppText } from './whatsapp-text';

type FormValues = Required<Omit<CreateLeadInput, 'budget'>> & { budget: string };

const fieldClass =
  'w-full rounded-xl border border-line-2 bg-surface-2 px-3.5 text-[15px] text-fg placeholder:text-fg-faint transition-colors focus:border-brand-soft focus:outline-none aria-[invalid=true]:border-red-400';

export function RequestDialog({
  open,
  initialService,
  whatsappNumber,
  onClose,
}: {
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

  const preview = buildWhatsAppMessage({ ...values, budget: values.budget || undefined });

  const focusFirstError = (fieldErrors: LeadFieldErrors) => {
    const first = Object.keys(fieldErrors)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage(undefined);

    const parsed = createLeadSchema.safeParse(payload());
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
        const result = await submitLead({ ...payload(), website });
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
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[980px] overflow-hidden rounded-3xl border border-line-2 bg-surface-3 p-0 text-fg shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_120px_rgba(249,115,22,0.22)] open:animate-fade-up"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-wrap overflow-y-auto">
        {doneUrl ? (
          <SuccessPanel url={doneUrl} titleId={`${id}-title`} onClose={onClose} />
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
                    Nueva solicitud
                  </p>
                  <h2
                    id={`${id}-title`}
                    className="mt-2.5 font-display text-2xl font-bold tracking-tight sm:text-[28px]"
                  >
                    Cuéntanos qué necesitas
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">
                    Completa los datos y continuamos la conversación por WhatsApp.
                  </p>
                </div>
                <CloseButton onClose={onClose} />
              </div>

              <fieldset className="flex flex-col gap-2.5">
                <legend className="mb-2.5 text-[13px] font-medium text-fg-soft">
                  Tipo de servicio
                </legend>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_LIST.map((service) => {
                    const selected = values.service === service.id;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => update('service', service.id)}
                        className={
                          selected
                            ? 'h-11 rounded-[10px] border border-brand-soft bg-brand/15 px-4 text-sm font-semibold text-white'
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
                  label="Nombre"
                  error={errors.name}
                  className="flex-[1_1_200px]"
                >
                  <input
                    id={`${id}-name`}
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={LEAD_LIMITS.name.max}
                    placeholder="Tu nombre"
                    value={values.name}
                    onChange={(e) => update('name', e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${id}-name-error` : undefined}
                    className={`${fieldClass} h-12`}
                  />
                </Field>
                <Field
                  id={`${id}-contact`}
                  label="Email o teléfono"
                  optional
                  error={errors.contact}
                  className="flex-[1_1_200px]"
                >
                  <input
                    id={`${id}-contact`}
                    name="contact"
                    type="text"
                    autoComplete="email"
                    maxLength={LEAD_LIMITS.contact.max}
                    placeholder="nombre@empresa.com"
                    value={values.contact}
                    onChange={(e) => update('contact', e.target.value)}
                    aria-invalid={Boolean(errors.contact)}
                    aria-describedby={errors.contact ? `${id}-contact-error` : undefined}
                    className={`${fieldClass} h-12`}
                  />
                </Field>
              </div>

              <Field id={`${id}-title-input`} label="Título del proyecto" error={errors.title}>
                <input
                  id={`${id}-title-input`}
                  name="title"
                  type="text"
                  maxLength={LEAD_LIMITS.title.max}
                  placeholder="Ej. Tienda online para mi negocio"
                  value={values.title}
                  onChange={(e) => update('title', e.target.value)}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? `${id}-title-input-error` : undefined}
                  className={`${fieldClass} h-12`}
                />
              </Field>

              <Field id={`${id}-description`} label="Descripción" error={errors.description}>
                <textarea
                  id={`${id}-description`}
                  name="description"
                  rows={4}
                  maxLength={LEAD_LIMITS.description.max}
                  placeholder="¿Qué necesitas? ¿Para cuándo? ¿Tienes alguna referencia?"
                  value={values.description}
                  onChange={(e) => update('description', e.target.value)}
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? `${id}-description-error` : undefined}
                  className={`${fieldClass} resize-y py-3 leading-normal`}
                />
              </Field>

              <Field
                id={`${id}-budget`}
                label="Presupuesto estimado"
                optional
                error={errors.budget}
              >
                <select
                  id={`${id}-budget`}
                  name="budget"
                  value={values.budget}
                  onChange={(e) => update('budget', e.target.value)}
                  className={`${fieldClass} h-12`}
                >
                  <option value="">Selecciona una opción</option>
                  {BUDGET_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Campo trampa para bots: oculto para personas y lectores de pantalla. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={`${id}-website`}>No completes este campo</label>
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
                  className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200"
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
                  {pending ? 'Enviando…' : 'Enviar por WhatsApp'}
                </button>
                <span className="inline-flex items-center gap-2 text-[13px] text-fg-muted">
                  <Lock className="size-4" aria-hidden="true" />
                  Guardamos tu solicitud y abrimos WhatsApp
                </span>
              </div>
            </form>

            <aside
              aria-label="Vista previa del mensaje"
              className="hidden min-w-0 flex-[1_1_340px] flex-col gap-5 border-l border-[#1f2236] bg-[#0b0d18] p-9 md:flex"
            >
              <p className="text-[13px] font-medium text-fg-soft">Vista previa del mensaje</p>
              <div className="overflow-hidden rounded-2xl border border-line bg-[#0e1a17]">
                <div className="flex items-center gap-3 border-b border-[#1b2f2a] bg-[#12221e] px-4 py-3.5">
                  <span className="flex size-9.5 items-center justify-center rounded-full bg-ink">
                    <LogoMark id="chat-preview" size={24} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">Mandaito Tech</span>
                    <span className="text-xs text-[#9fb8b0]">Cuenta de empresa</span>
                  </span>
                </div>
                <div className="flex flex-col items-end px-4 pt-5 pb-6">
                  <div className="max-w-full rounded-[14px_14px_4px_14px] bg-[#1e5a45] px-3.5 py-3 text-sm leading-relaxed break-words whitespace-pre-line text-[#eaf7f1]">
                    <WhatsAppText text={preview} />
                  </div>
                  <span className="mt-1.5 text-[11px] text-[#9fb8b0]">
                    Se enviará al número de Mandaito Tech
                  </span>
                </div>
              </div>
              <ol className="flex flex-col gap-3.5">
                {[
                  'Registramos tu solicitud para no perder ningún detalle.',
                  'Se abre WhatsApp con el mensaje listo para enviar.',
                  'Te respondemos con preguntas y una propuesta.',
                ].map((step, index) => (
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
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-[13px] font-medium text-fg-soft">
        {label} {optional ? <span className="text-fg-faint">(opcional)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Cerrar"
      className="flex size-11 flex-none items-center justify-center rounded-xl border border-line-2 bg-white/4 text-fg-soft transition-colors hover:bg-white/8 hover:text-fg"
    >
      <X className="size-4.5" aria-hidden="true" />
    </button>
  );
}

function SuccessPanel({
  url,
  titleId,
  onClose,
}: {
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
        ¡Listo! Recibimos tu solicitud
      </h2>
      <p className="max-w-md text-[15px] leading-relaxed text-fg-muted">
        Abrimos WhatsApp con tu mensaje. Si no se abrió automáticamente, usa el botón de abajo para
        enviarlo.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-13 items-center gap-2.5 rounded-xl bg-whatsapp px-6 font-semibold text-whatsapp-ink transition hover:-translate-y-px"
        >
          <WhatsAppIcon className="size-5" />
          Abrir WhatsApp
        </a>
        <button
          type="button"
          onClick={onClose}
          className="h-13 rounded-xl border border-line-3 bg-white/5 px-6 font-semibold text-fg transition-colors hover:bg-white/10"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
