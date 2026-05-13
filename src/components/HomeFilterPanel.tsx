import type { FilterMenu } from "@/types/map";

type Props = {
  openFilterMenu: FilterMenu;
  toggleFilter: (menu: FilterMenu) => void;

  selectedRoomTypes: string[];
  setSelectedRoomTypes: React.Dispatch<React.SetStateAction<string[]>>;

  selectedTradeTypes: string[];
  setSelectedTradeTypes: React.Dispatch<React.SetStateAction<string[]>>;

  selectedApprovalDate: string | null;
  setSelectedApprovalDate: React.Dispatch<React.SetStateAction<string | null>>;

  selectedRooms: string[];
  setSelectedRooms: React.Dispatch<React.SetStateAction<string[]>>;

  deposit: number;
  setDeposit: React.Dispatch<React.SetStateAction<number>>;
  confirmedDeposit: number;
  setConfirmedDeposit: React.Dispatch<React.SetStateAction<number>>;

  rent: number;
  setRent: React.Dispatch<React.SetStateAction<number>>;
  confirmedRent: number;
  setConfirmedRent: React.Dispatch<React.SetStateAction<number>>;

  roomSize: number;
  setRoomSize: React.Dispatch<React.SetStateAction<number>>;
  confirmedRoomSize: number;
  setConfirmedRoomSize: React.Dispatch<React.SetStateAction<number>>;

  selectedCommuteTime: string | null;
  setSelectedCommuteTime: React.Dispatch<React.SetStateAction<string | null>>;

  selectedWalkTime: string | null;
  setSelectedWalkTime: React.Dispatch<React.SetStateAction<string | null>>;

  selectedTransfers: string | null;
  setSelectedTransfers: React.Dispatch<React.SetStateAction<string | null>>;

  isBudgetTouched: boolean;
  setIsBudgetTouched: React.Dispatch<React.SetStateAction<boolean>>;

  isRoomSizeTouched: boolean;
  setIsRoomSizeTouched: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HomeFilterPanel({
  openFilterMenu,
  toggleFilter,

  selectedRoomTypes,
  setSelectedRoomTypes,

  selectedTradeTypes,
  setSelectedTradeTypes,

  selectedApprovalDate,
  setSelectedApprovalDate,

  selectedRooms,
  setSelectedRooms,

  deposit,
  setDeposit,
  confirmedDeposit,
  setConfirmedDeposit,

  rent,
  setRent,
  confirmedRent,
  setConfirmedRent,

  roomSize,
  setRoomSize,
  confirmedRoomSize,
  setConfirmedRoomSize,

  selectedCommuteTime,
  setSelectedCommuteTime,

  selectedWalkTime,
  setSelectedWalkTime,

  selectedTransfers,
  setSelectedTransfers,

  isBudgetTouched,
  setIsBudgetTouched,

  isRoomSizeTouched,
  setIsRoomSizeTouched,
}: Props) {
  const toggleOption = (
    value: string,
    selectedValues: string[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const optionClass = (isSelected: boolean) =>
    `rounded-xl border p-3 font-semibold transition ${
      isSelected
        ? "border-slate-900 bg-(--color-primary) text-white"
        : "border-(--color-border) bg-white text-slate-700 hover:bg-slate-50"
    }`;

  const pillClass = (isSelected: boolean) =>
    `rounded-full border px-4 py-2 font-semibold transition ${
      isSelected
        ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
        : "border-[var(--color-border)] bg-white text-slate-700 hover:bg-[var(--color-bg)]"
    }`;

  const formatKoreanMoney = (value: number) => {
    if (value >= 10000) {
      const eok = Math.floor(value / 10000);
      const rest = value % 10000;

      if (rest === 0) {
        return `${eok}억원`;
      }

      if (rest % 1000 === 0) {
        return `${eok}억 ${rest / 1000}천만원`;
      }

      return `${eok}억 ${rest.toLocaleString()}만원`;
    }

    return `${value.toLocaleString()}만원`;
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {[
          ["roomType", "매물 유형"],
          ["trade", "거래 유형"],
          ["budget", "가격"],
          ["commute", "출퇴근"],
          ["roomSize", "방 크기"],
          ["rooms", "방 개수"],
          ["approvalDate", "사용승인일"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              toggleFilter(key as FilterMenu);

              if (key === "budget") {
                setIsBudgetTouched(true);
              }

              if (key === "roomSize") {
                setIsRoomSizeTouched(true);
              }
            }}
            className={`rounded-xl border px-5 py-3 font-semibold ${
              openFilterMenu === key
                ? "border-slate-900 bg-(--color-primary) text-white"
                : "bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {openFilterMenu && (
        <div className="mt-4 rounded-2xl border bg-gray-50 p-5">
          {openFilterMenu === "roomType" && (
            <>
              <p className="mb-4 font-bold">매물 유형</p>

              <div className="flex flex-wrap gap-2">
                {["오피스텔", "원룸/투룸", "아파트", "쉐어하우스"].map((item) => {
                  const isSelected = selectedRoomTypes.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleOption(
                          item,
                          selectedRoomTypes,
                          setSelectedRoomTypes
                        )
                      }
                      className={pillClass(isSelected)}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {openFilterMenu === "trade" && (
            <>
              <p className="mb-4 font-bold">거래 유형</p>

              <div className="flex flex-wrap gap-2">
                {["월세", "전세", "매매"].map((item) => {
                  const isSelected = selectedTradeTypes.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleOption(
                          item,
                          selectedTradeTypes,
                          setSelectedTradeTypes
                        )
                      }
                      className={pillClass(isSelected)}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-4 rounded-2xl border bg-white p-4">
        <p className="mb-3 font-bold">선택한 조건</p>

        <div className="flex flex-wrap gap-2 text-sm">
          {selectedRoomTypes.length > 0 && (
            <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
              매물 유형: {selectedRoomTypes.join(", ")}
            </span>
          )}

          {selectedTradeTypes.length > 0 && (
            <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
              거래 유형: {selectedTradeTypes.join(", ")}
            </span>
          )}

          {isBudgetTouched && (
            <>
              <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                보증금:{" "}
                {confirmedDeposit >= 20000
                  ? "무제한"
                  : formatKoreanMoney(confirmedDeposit)}{" "}
                이하
              </span>

              <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
                월세: {confirmedRent >= 150 ? "무제한" : `${confirmedRent}만원`} 이하
              </span>
            </>
          )}

          {selectedCommuteTime && (
            <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
              소요시간: {selectedCommuteTime}
            </span>
          )}

          {selectedWalkTime && (
            <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
              도보시간: {selectedWalkTime}
            </span>
          )}

          {selectedTransfers && (
            <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
              환승횟수: {selectedTransfers}
            </span>
          )}

          {isRoomSizeTouched && (
            <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
              방 크기: {confirmedRoomSize}평 이상
            </span>
          )}

          {selectedRooms.length > 0 && (
            <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
              방 개수: {selectedRooms.join(", ")}
            </span>
          )}

          {selectedApprovalDate && (
            <span className="rounded-full bg-(--color-primary) px-3 py-1 text-white">
              사용승인일: {selectedApprovalDate}
            </span>
          )}
        </div>
      </div>
    </>
  );
}