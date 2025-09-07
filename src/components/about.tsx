import { X } from 'lucide-react'

interface aboutChecks {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: aboutChecks) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative z-20 p-8 max-w-4xl w-full bg-black/30 backdrop-blur-md border border-white/20 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
          <X className="h-6 w-6" />
        </button>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>
        <div className="flex flex-col gap-4 text-white">temp</div>

      </div>
    </div>
  );
}