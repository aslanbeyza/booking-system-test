export type ConsultantMetaProps = {
  ratingText?: string;
  locationText?: string;
};

export default function ConsultantMeta({
  ratingText,
  locationText,
}: ConsultantMetaProps) {
  if (!ratingText && !locationText) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-black/60">
      {ratingText ? <span>{ratingText}</span> : null}
      {locationText ? <span>{locationText}</span> : null}
    </div>
  );
}

