/** Muestra un texto con la sintaxis de WhatsApp (*negrita*) como HTML seguro. */
export function WhatsAppText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*\n]+\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <strong key={index}>{part.slice(1, -1)}</strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}
