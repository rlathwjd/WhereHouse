import { useState } from "react";
import {
  MapPin,
  Home,
  Repeat2,
  Wallet,
  Maximize2,
  Bed,
  CalendarDays,
  Search,
} from "lucide-react";

import type { FilterMenu } from "@/types/map";

const FILTER_MENUS = [
  { key: "region", label: "지역", icon: MapPin },
  { key: "roomType", label: "매물 유형", icon: Home },
  { key: "trade", label: "거래 유형", icon: Repeat2 },
  { key: "budget", label: "가격", icon: Wallet },
  { key: "roomSize", label: "방 크기", icon: Maximize2 },
  { key: "rooms", label: "방 개수", icon: Bed },
  { key: "approvalDate", label: "사용승인일", icon: CalendarDays },
] as const;

type RegionGroupKey = "seoul" | "gyeonggi" | "incheon";

const REGION_GROUPS: {
  key: RegionGroupKey;
  label: string;
  valuePrefix: string;
  items: string[];
}[] = [
    {
      key: "seoul",
      label: "서울",
      valuePrefix: "서울특별시",
      items: [
        "강남구",
        "강동구",
        "강북구",
        "강서구",
        "관악구",
        "광진구",
        "구로구",
        "금천구",
        "노원구",
        "도봉구",
        "동대문구",
        "동작구",
        "마포구",
        "서대문구",
        "서초구",
        "성동구",
        "성북구",
        "송파구",
        "양천구",
        "영등포구",
        "용산구",
        "은평구",
        "종로구",
        "중구",
        "중랑구",
      ],
    },
    {
      key: "gyeonggi",
      label: "경기",
      valuePrefix: "경기도",
      items: [
        "가평군",
        "고양시",
        "과천시",
        "광명시",
        "광주시",
        "구리시",
        "군포시",
        "김포시",
        "남양주시",
        "동두천시",
        "부천시",
        "성남시",
        "수원시",
        "시흥시",
        "안산시",
        "안성시",
        "안양시",
        "양주시",
        "양평군",
        "여주시",
        "연천군",
        "오산시",
        "용인시",
        "의왕시",
        "의정부시",
        "이천시",
        "파주시",
        "평택시",
        "포천시",
        "하남시",
        "화성시",
      ],
    },
    {
      key: "incheon",
      label: "인천",
      valuePrefix: "인천광역시",
      items: [
        "강화군",
        "계양구",
        "남동구",
        "동구",
        "미추홀구",
        "부평구",
        "서구",
        "연수구",
        "옹진군",
        "중구",
      ],
    },
  ];

const ROOM_TYPES = ["오피스텔", "원룸/투룸", "아파트", "쉐어하우스"];

const TRADE_TYPES = ["월세", "전세", "매매"];

const ROOM_COUNTS = ["원룸", "1.5룸", "투룸", "쓰리룸 이상"];

const APPROVAL_DATES = ["5년 이내", "10년 이내", "15년 이내", "20년 이내"];

type Props = {
  openFilterMenu: FilterMenu;
  toggleFilter: (menu: FilterMenu) => void;

  selectedRegions: string[];
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;

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

  isBudgetTouched: boolean;
  setIsBudgetTouched: React.Dispatch<React.SetStateAction<boolean>>;

  isRoomSizeTouched: boolean;
  setIsRoomSizeTouched: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HomeFilterPanel({
  openFilterMenu,
  toggleFilter,

  selectedRegions,
  setSelectedRegions,

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

  isBudgetTouched,
  setIsBudgetTouched,

  isRoomSizeTouched,
  setIsRoomSizeTouched,
}: Props) {
  const [activeRegionGroup, setActiveRegionGroup] =
    useState<RegionGroupKey>("seoul");

  const toggleOption = (
    value: string,
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const pillClass = (isSelected: boolean) =>
    `rounded-full border px-4 py-2 text-xs font-semibold transition ${isSelected
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

  const activeRegionGroupData = REGION_GROUPS.find(
    (group) => group.key === activeRegionGroup
  );

  const activeRegionItems = activeRegionGroupData?.items ?? [];

  const activeRegionValues = activeRegionItems.map(
    (item) => `${activeRegionGroupData?.valuePrefix} ${item}`
  );

  const isAllActiveRegionsSelected =
    activeRegionValues.length > 0 &&
    activeRegionValues.every((value) => selectedRegions.includes(value));

  const toggleAllActiveRegions = () => {
    setSelectedRegions((prev) => {
      if (isAllActiveRegionsSelected) {
        return prev.filter((item) => !activeRegionValues.includes(item));
      }

      return Array.from(new Set([...prev, ...activeRegionValues]));
    });
  };

  const getRegionConditionText = () => {
    const result: string[] = [];
    const partialRegions: string[] = [];

    REGION_GROUPS.forEach((group) => {
      const groupValues = group.items.map(
        (item) => `${group.valuePrefix} ${item}`
      );

      const isAllSelected = groupValues.every((value) =>
        selectedRegions.includes(value)
      );

      if (isAllSelected) {
        result.push(`${group.label} 전체`);
        return;
      }

      group.items.forEach((item) => {
        const value = `${group.valuePrefix} ${item}`;

        if (selectedRegions.includes(value)) {
          partialRegions.push(`${group.label} ${item}`);
        }
      });
    });

    return [...result, ...partialRegions].join(", ");
  };

  return (
    <div>
      {/* 조건 필터 */}
      <div className="flex flex-wrap gap-3 text-sm">
        {FILTER_MENUS.map(({ key, label, icon: Icon }) => (
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
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 font-bold transition ${openFilterMenu === key
              ? "border-slate-900 bg-[var(--color-primary)] text-white shadow-sm"
              : "border-[var(--color-border)] bg-white text-slate-700 hover:bg-gray-50 hover:text-slate-950"
              }`}
          >
            <Icon size={17} strokeWidth={2.4} />
            {label}
          </button>
        ))}
      </div>

      {/* 조건 필터 클릭 시 나오는 화면 */}
      {openFilterMenu && (
        <div className="mt-4 rounded-2xl border border-gray-300 bg-gray-50 p-5 shadow-sm">
          {openFilterMenu === "region" && (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="font-bold">지역</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap gap-2">
                  {REGION_GROUPS.map((group) => {
                    const isActive = activeRegionGroup === group.key;

                    return (
                      <button
                        key={group.key}
                        type="button"
                        onClick={() => setActiveRegionGroup(group.key)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isActive
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                          : "border-[var(--color-border)] bg-white text-slate-700 hover:bg-gray-50"
                          }`}
                      >
                        {group.label}
                      </button>


                    );
                  })}
                </div>

                <div className="my-4 border-t border-gray-200" />

                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-700">
                      {REGION_GROUPS.find((group) => group.key === activeRegionGroup)?.label} 지역
                    </p>

                    <span className="text-sm font-semibold text-slate-500">
                      {activeRegionValues.filter((value) => selectedRegions.includes(value)).length}
                      /{activeRegionItems.length} 선택
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAllActiveRegions}
                    className="shrink-0 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:border-slate-900 hover:bg-gray-50 hover:text-slate-950"
                  >
                    {isAllActiveRegionsSelected ? "전체 해제" : "전체 선택"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeRegionItems.map((item) => {
                    const value = `${activeRegionGroupData?.valuePrefix} ${item}`;
                    const isSelected = selectedRegions.includes(value);

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          toggleOption(value, setSelectedRegions)
                        }
                        className={pillClass(isSelected)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {openFilterMenu === "roomType" && (
            <>
              <p className="mb-4 font-bold">매물 유형</p>
              <div className="flex flex-wrap gap-2">
                {ROOM_TYPES.map((item) => {
                  const isSelected = selectedRoomTypes.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleOption(
                          item,
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
                {TRADE_TYPES.map((item) => {
                  const isSelected = selectedTradeTypes.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleOption(
                          item,
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

          {openFilterMenu === "budget" && (
            <>
              <p className="mb-4 font-bold">가격</p>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-600">보증금</span>
                    <span className="font-bold text-gray-900">
                      {deposit >= 20000
                        ? "무제한"
                        : `${formatKoreanMoney(deposit)} 이하`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={20000}
                    step={500}
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    onMouseUp={() => setConfirmedDeposit(deposit)}
                    onTouchEnd={() => setConfirmedDeposit(deposit)}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-600">월세</span>
                    <span className="font-bold text-gray-900">
                      {rent >= 150 ? "무제한" : `${rent}만원 이하`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={150}
                    step={5}
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    onMouseUp={() => setConfirmedRent(rent)}
                    onTouchEnd={() => setConfirmedRent(rent)}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}

          {openFilterMenu === "roomSize" && (
            <>
              <p className="mb-4 font-bold">방 크기</p>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">최소 평수</span>
                  <span className="font-bold text-gray-900">
                    {roomSize}평 이상
                  </span>
                </div>

                <input
                  type="range"
                  min={3}
                  max={30}
                  step={1}
                  value={roomSize}
                  onChange={(e) => setRoomSize(Number(e.target.value))}
                  onMouseUp={() => setConfirmedRoomSize(roomSize)}
                  onTouchEnd={() => setConfirmedRoomSize(roomSize)}
                  className="w-full"
                />
              </div>
            </>
          )}

          {openFilterMenu === "rooms" && (
            <>
              <p className="mb-4 font-bold">방 개수</p>

              <div className="flex flex-wrap gap-2">
                {ROOM_COUNTS.map((item) => {
                  const isSelected = selectedRooms.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleOption(item, setSelectedRooms)
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

          {openFilterMenu === "approvalDate" && (
            <>
              <p className="mb-4 font-bold">사용승인일</p>

              <div className="flex flex-wrap gap-2">
                {APPROVAL_DATES.map((item) => {
                  const isSelected = selectedApprovalDate === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setSelectedApprovalDate((prev) =>
                          prev === item ? null : item
                        )
                      }
                      className={pillClass(isSelected)}
                    >
                      {item}
                    </button>
                  );
                }
                )}
              </div>
            </>
          )}
        </div>
      )
      }

      {/* 선택한 조건 */}
      <div className="mt-4 rounded-2xl border border-gray-300 bg-gray-50 px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Search size={18} strokeWidth={2.4} className="text-slate-900" />

          <p className="text-sm font-extrabold text-slate-900">
            선택한 조건
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 pl-7 text-xs">
          {selectedRegions.length > 0 && (
            <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-white">
              지역: {getRegionConditionText()}
            </span>
          )}

          {selectedRoomTypes.length > 0 && (
            <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-white">
              매물 유형: {selectedRoomTypes.join(", ")}
            </span>
          )}

          {selectedTradeTypes.length > 0 && (
            <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-white">
              거래 유형: {selectedTradeTypes.join(", ")}
            </span>
          )}

          {isBudgetTouched && (
            <>
              <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-white">
                보증금:{" "}
                {confirmedDeposit >= 20000
                  ? "무제한"
                  : formatKoreanMoney(confirmedDeposit)}{" "}
                이하
              </span>

              <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-white">
                월세: {confirmedRent >= 150 ? "무제한" : `${confirmedRent}만원`} 이하
              </span>
            </>
          )}

          {isRoomSizeTouched && (
            <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-white">
              방 크기: {confirmedRoomSize}평 이상
            </span>
          )}

          {selectedRooms.length > 0 && (
            <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-white">
              방 개수: {selectedRooms.join(", ")}
            </span>
          )}

          {selectedApprovalDate && (
            <span className="rounded-full bg-[var(--color-primary)] px-3 py-1 text-white">
              사용승인일: {selectedApprovalDate}
            </span>
          )}

          {selectedRegions.length === 0 &&
            selectedRoomTypes.length === 0 &&
            selectedTradeTypes.length === 0 &&
            !isBudgetTouched &&
            !isRoomSizeTouched &&
            selectedRooms.length === 0 &&
            !selectedApprovalDate && (
              <span className="text-sm font-medium text-gray-400">
                아직 선택한 조건이 없습니다.
              </span>
            )}
        </div>
      </div>
    </div >
  );
}

