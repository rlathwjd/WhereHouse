import { House } from "lucide-react";

type HomeCardProps = {
    onClick: () => void;
};

export default function HomeCard({ onClick }: HomeCardProps) {
    return (
        <div className="rounded-2xl bg-[#fef8ec] p-5 text-[#374151] shadow-sm transition-transform duration-300">
            <button
                type="button"
                onClick={onClick}
                className="flex min-h-[80px] w-full items-center justify-center gap-4 active:scale-[0.98]"
            >
                <div className="flex items-center gap-3">
                    <House size={28} className="text-[#6B5B4D]" />

                    <span className="text-2xl font-bold text-[#1F2937]">
                        집
                    </span>
                </div>

                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#94A3B8] bg-white text-3xl text-[#475569] transition-colors duration-200 hover:bg-[#F1F5F9]">
                    +
                </span>
            </button>
        </div>
    );
}