import type { Frame, Palette } from "@/lib/qrTemplates";

export default function QRCardPreview({
  frame,
  palette,
  eventTitle,
  eventSubtitle,
  eventDate,
  qrSrc,
  logoSrc,
}: {
  frame: Frame;
  palette: Palette;
  eventTitle?: string;
  eventSubtitle?: string;
  eventDate?: string;
  qrSrc?: string;
  logoSrc?: string;
}) {
  return (
    <div
      className="relative flex flex-col items-center justify-between gap-2 p-4 aspect-[3/4] w-full overflow-hidden"
      style={{
        background: palette.bg,
        color: palette.ink,
        borderColor: palette.accent,
        borderRadius: frame.radius,
        borderStyle: frame.borderStyle,
        borderWidth: frame.borderStyle === "double" ? 6 : 3,
      }}
    >
      {frame.innerInset && (
        <div
          className="absolute inset-2 pointer-events-none"
          style={{
            border: `1px solid ${palette.accent}`,
            borderRadius: Math.max(frame.radius - 6, 0),
          }}
        />
      )}

      {frame.cornerMarks && (
        <>
          <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: palette.accent }} />
          <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: palette.accent }} />
          <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: palette.accent }} />
          <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: palette.accent }} />
        </>
      )}

      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="" className="w-8 h-8 object-contain z-10" />
      ) : (
        <span className="w-8 h-8" />
      )}

      <div className="text-center z-10">
        {eventTitle && (
          <p className="text-[10px] font-black uppercase tracking-widest leading-tight" style={{ color: palette.accent }}>
            {eventTitle}
          </p>
        )}
        {eventSubtitle && <p className="text-xs font-bold mt-1 leading-tight">{eventSubtitle}</p>}
      </div>

      {qrSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qrSrc} alt="QR Code" className="w-2/3 aspect-square object-contain z-10" />
      ) : (
        <div className="w-2/3 aspect-square flex items-center justify-center text-[8px] font-bold uppercase tracking-widest z-10" style={{ background: `${palette.accent}33` }}>
          QR
        </div>
      )}

      {eventDate && (
        <p className="text-[9px] font-bold uppercase tracking-widest z-10">{eventDate}</p>
      )}
    </div>
  );
}
