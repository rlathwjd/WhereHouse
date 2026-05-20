import { useState } from "react";
import {
  MapPin,
  Home,
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

const ROOM_TYPES = ["오피스텔", "원룸/투룸", "아파트", "쉐어하우스"] as const;

const TRADE_TYPES = ["월세", "전세", "매매"] as const;
type TradeType = (typeof TRADE_TYPES)[number];

type BudgetTab = "monthly" | "lease" | "sale";

const TRADE_TYPE_TO_BUDGET_TAB: Record<TradeType, BudgetTab> = {
  월세: "monthly",
  전세: "lease",
  매매: "sale",
};

const BUDGET_TAB_TO_TRADE_TYPE: Record<BudgetTab, TradeType> = {
  monthly: "월세",
  lease: "전세",
  sale: "매매",
};

const ROOM_COUNTS = ["원룸", "1.5룸", "투룸", "쓰리룸 이상"];

const APPROVAL_DATES = ["5년 이내", "10년 이내", "15년 이내", "20년 이내"];

type BudgetMaxControlProps = {
  title: string;
  subtitle: string;
  value: number;
  minLimit?: number;
  maxLimit: number;
  step: number;
  unit: string;
  badgeText: string;
  inputLabel: string;
  minLabel: string;
  maxLabel: string;
  placeholder?: string;
  onChange: (value: number) => void;
  onConfirm: (value: number) => void;
};

type Props = {
  isCollapsed?: boolean;

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

  monthlyDeposit: number;
  setMonthlyDeposit: React.Dispatch<React.SetStateAction<number>>;
  confirmedMonthlyDeposit: number;
  setConfirmedMonthlyDeposit: React.Dispatch<React.SetStateAction<number>>;

  monthlyRent: number;
  setMonthlyRent: React.Dispatch<React.SetStateAction<number>>;
  confirmedMonthlyRent: number;
  setConfirmedMonthlyRent: React.Dispatch<React.SetStateAction<number>>;

  leaseDeposit: number;
  setLeaseDeposit: React.Dispatch<React.SetStateAction<number>>;
  confirmedLeaseDeposit: number;
  setConfirmedLeaseDeposit: React.Dispatch<React.SetStateAction<number>>;

  salePrice: number;
  setSalePrice: React.Dispatch<React.SetStateAction<number>>;
  confirmedSalePrice: number;
  setConfirmedSalePrice: React.Dispatch<React.SetStateAction<number>>;

  roomSize: number;
  setRoomSize: React.Dispatch<React.SetStateAction<number>>;
  confirmedRoomSize: number;
  setConfirmedRoomSize: React.Dispatch<React.SetStateAction<number>>;

  isBudgetTouched: boolean;
  setIsBudgetTouched: React.Dispatch<React.SetStateAction<boolean>>;

  isRoomSizeTouched: boolean;
  setIsRoomSizeTouched: React.Dispatch<React.SetStateAction<boolean>>;
};

function BudgetMaxControl({
  title,
  subtitle,
  value,
  minLimit = 0,
  maxLimit,
  step,
  unit,
  badgeText,
  inputLabel,
  minLabel,
  maxLabel,
  placeholder,
  onChange,
  onConfirm,
}: BudgetMaxControlProps) {
  const percent = Math.min(
    ((value - minLimit) / (maxLimit - minLimit)) * 100,
    100
  );

  const handleChangeValue = (nextValue: number) => {
    const safeValue = Number.isFinite(nextValue)
      ? Math.min(Math.max(nextValue, minLimit), maxLimit)
      : minLimit;

    onChange(safeValue);
    return safeValue;
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {badgeText}
        </div>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-semibold text-slate-500">{inputLabel}</span>

        <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 transition focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
          <input
            type="number"
            value={value}
            min={0}
            max={maxLimit}
            step={step}
            placeholder={placeholder}
            onChange={(e) => handleChangeValue(Number(e.target.value))}
            onBlur={() => onConfirm(value)}
            className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none"
          />

          <span className="ml-1 text-xs font-semibold text-slate-400">
            {unit}
          </span>
        </div>
      </label>

      <div className="mt-6">
        <div className="relative h-7">
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />

          <div
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-600"
            style={{ width: `${percent}%` }}
          />

          <input
            type="range"
            min={0}
            max={maxLimit}
            step={step}
            value={value}
            onChange={(e) => handleChangeValue(Number(e.target.value))}
            onMouseUp={(e) => onConfirm(Number(e.currentTarget.value))}
            onTouchEnd={(e) => onConfirm(Number(e.currentTarget.value))}
            className="range-thumb absolute left-0 top-0 h-7 w-full appearance-none bg-transparent"
          />
        </div>

        <div className="mt-1 flex justify-between text-[11px] font-medium text-slate-400">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default function HomeFilterPanel({
  isCollapsed = false,

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

  monthlyDeposit,
  setMonthlyDeposit,
  confirmedMonthlyDeposit,
  setConfirmedMonthlyDeposit,

  monthlyRent,
  setMonthlyRent,
  confirmedMonthlyRent,
  setConfirmedMonthlyRent,

  leaseDeposit,
  setLeaseDeposit,
  confirmedLeaseDeposit,
  setConfirmedLeaseDeposit,

  salePrice,
  setSalePrice,
  confirmedSalePrice,
  setConfirmedSalePrice,

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

  const [budgetTab, setBudgetTab] = useState<BudgetTab>("monthly");

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

  const selectTradeType = (tradeType: TradeType) => {
    setSelectedTradeTypes((prev) =>
      prev.includes(tradeType) ? prev : [...prev, tradeType]
    );
  };

  const markBudgetTouched = (tradeType: TradeType) => {
    setIsBudgetTouched(true);
    selectTradeType(tradeType);
  };

  const confirmBudgetValue = (tradeType: TradeType) => {
    if (tradeType === "월세") {
      setConfirmedMonthlyDeposit(monthlyDeposit);
      setConfirmedMonthlyRent(monthlyRent);
      return;
    }

    if (tradeType === "전세") {
      setConfirmedLeaseDeposit(leaseDeposit);
      return;
    }

    setConfirmedSalePrice(salePrice);
  };

  const activateBudgetTab = (tabKey: BudgetTab) => {
    const tradeType = BUDGET_TAB_TO_TRADE_TYPE[tabKey];

    setBudgetTab(tabKey);
    markBudgetTouched(tradeType);
    confirmBudgetValue(tradeType);
  };

  const pillClass = (isSelected: boolean) =>
    `rounded-full border px-4 py-2 text-xs font-semibold transition ${isSelected
      ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
      : "border-[var(--color-border)] bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    }`;

  const conditionTagClass =
    "rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100";

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

  const hasSelectedConditions =
    selectedRegions.length > 0 ||
    selectedRoomTypes.length > 0 ||
    selectedTradeTypes.length > 0 ||
    isBudgetTouched ||
    isRoomSizeTouched ||
    selectedRooms.length > 0 ||
    Boolean(selectedApprovalDate);

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

  const resetSelectedConditions = () => {
    setSelectedRegions([]);
    setSelectedRoomTypes([]);
    setSelectedTradeTypes([]);
    setSelectedApprovalDate(null);
    setSelectedRooms([]);

    setMonthlyDeposit(7000);
    setMonthlyRent(70);
    setLeaseDeposit(7000);
    setSalePrice(500000);
    setRoomSize(10);

    setConfirmedMonthlyDeposit(7000);
    setConfirmedMonthlyRent(70);
    setConfirmedLeaseDeposit(7000);
    setConfirmedSalePrice(500000);
    setConfirmedRoomSize(10);

    setIsBudgetTouched(false);
    setIsRoomSizeTouched(false);

    if (openFilterMenu) {
      toggleFilter(openFilterMenu);
    }
  };

  return (
    <div>
      {/* 조건 필터 */}
      <div className={`${isCollapsed ? "hidden" : ""}`}>
        <div className="flex flex-wrap gap-2 text-sm">
          {FILTER_MENUS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                const menu = key as FilterMenu;
                const isOpeningMenu = openFilterMenu !== menu;

                toggleFilter(menu);

                if (key === "budget" && isOpeningMenu) {
                  activateBudgetTab(budgetTab);
                }

                if (key === "roomSize" && isOpeningMenu) {
                  setIsRoomSizeTouched(true);
                  setConfirmedRoomSize(roomSize);
                }
              }}
              className={`flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-bold transition ${openFilterMenu === key
                ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                : "border-gray-200 bg-white text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
              <Icon size={17} strokeWidth={2.4} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 조건 필터 클릭 시 나오는 화면 */}
      {!isCollapsed && openFilterMenu && (
        <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.15)]">
          {openFilterMenu === "region" && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-start gap-2">
                  {REGION_GROUPS.map((group) => {
                    const isActive = activeRegionGroup === group.key;

                    return (
                      <button
                        key={group.key}
                        type="button"
                        onClick={() => setActiveRegionGroup(group.key)}
                        className={`min-w-[64px] rounded-full border px-3.5 py-2 text-sm font-bold transition ${isActive
                          ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                      >
                        {group.label}
                      </button>
                    );
                  })}
                </div>

                <div className="my-4 border-t border-gray-200" />

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {
                        REGION_GROUPS.find(
                          (group) => group.key === activeRegionGroup
                        )?.label
                      }{" "}
                      지역
                    </p>
                    <p className="text-xs text-slate-500">
                      선택된 지역{" "}
                      {
                        activeRegionValues.filter((value) =>
                          selectedRegions.includes(value)
                        ).length
                      }{" "}
                      / {activeRegionItems.length}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={toggleAllActiveRegions}
                    className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {isAllActiveRegionsSelected ? "전체 해제" : "전체 선택"}
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {activeRegionItems.map((item) => {
                    const value = `${activeRegionGroupData?.valuePrefix} ${item}`;
                    const isSelected = selectedRegions.includes(value);

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleOption(value, setSelectedRegions)}
                        className={pillClass(isSelected)}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
            </div>
          )}

          {openFilterMenu === "roomType" && (
            <div className="grid grid-cols-4 gap-2">
              {ROOM_TYPES.map((item) => {
                const isSelected = selectedRoomTypes.includes(item);

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleOption(item, setSelectedRoomTypes)}
                    className={pillClass(isSelected)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          )}

          {openFilterMenu === "budget" && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {/* 월세 / 전세 / 매매 탭 */}
                <div className="grid grid-cols-3 border-b border-gray-200 text-sm font-bold">
                  {TRADE_TYPES.map((tradeType) => {
                    const tabKey = TRADE_TYPE_TO_BUDGET_TAB[tradeType];
                    const isActive = tabKey === budgetTab;

                    return (
                      <button
                        key={tradeType}
                        type="button"
                        onClick={() => activateBudgetTab(tabKey)}
                        className={`py-3 transition ${isActive
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        {tradeType}
                      </button>
                    );
                  })}
                </div>

                {/* 탭별 가격 조건 */}
                <div className="bg-slate-50 p-5">
                  {budgetTab === "monthly" && (
                    <div className="grid gap-5 lg:grid-cols-2">
                      <BudgetMaxControl
                        title="보증금"
                        subtitle="월세 보증금 최대값"
                        value={monthlyDeposit}
                        maxLimit={20000}
                        step={500}
                        unit="만원"
                        badgeText={
                          monthlyDeposit >= 20000
                            ? "무제한"
                            : `${formatKoreanMoney(monthlyDeposit)} 이하`
                        }
                        inputLabel="최대 금액"
                        minLabel="0"
                        maxLabel={`${formatKoreanMoney(20000)}+`}
                        placeholder="예: 7000"
                        onChange={(value) => {
                          markBudgetTouched("월세");
                          setMonthlyDeposit(value);
                        }}
                        onConfirm={setConfirmedMonthlyDeposit}
                      />

                      <BudgetMaxControl
                        title="월세"
                        subtitle="월세 최대값"
                        value={monthlyRent}
                        maxLimit={150}
                        step={5}
                        unit="만원"
                        badgeText={
                          monthlyRent >= 150 ? "무제한" : `${monthlyRent}만원 이하`
                        }
                        inputLabel="최대 금액"
                        minLabel="0"
                        maxLabel={`${formatKoreanMoney(150)}+`}
                        placeholder="예: 50"
                        onChange={(value) => {
                          markBudgetTouched("월세");
                          setMonthlyRent(value);
                        }}
                        onConfirm={setConfirmedMonthlyRent}
                      />
                    </div>
                  )}

                  {budgetTab === "lease" && (
                    <BudgetMaxControl
                      title="전세금"
                      subtitle="전세 보증금 최대값"
                      value={leaseDeposit}
                      maxLimit={20000}
                      step={500}
                      unit="만원"
                      badgeText={
                        leaseDeposit >= 20000
                          ? "무제한"
                          : `${formatKoreanMoney(leaseDeposit)} 이하`
                      }
                      inputLabel="최대 금액"
                      minLabel="0"
                      maxLabel={`${formatKoreanMoney(20000)}+`}
                      placeholder="예: 20000"
                      onChange={(value) => {
                        markBudgetTouched("전세");
                        setLeaseDeposit(value);
                      }}
                      onConfirm={setConfirmedLeaseDeposit}
                    />
                  )}

                  {budgetTab === "sale" && (
                    <BudgetMaxControl
                      title="매매가"
                      subtitle="매매 금액 최대값"
                      value={salePrice}
                      maxLimit={500000}
                      step={5000}
                      unit="만원"
                      badgeText={
                        salePrice >= 500000
                          ? "무제한"
                          : `${formatKoreanMoney(salePrice)} 이하`
                      }
                      inputLabel="최대 금액"
                      minLabel="0"
                      maxLabel={`${formatKoreanMoney(500000)}+`}
                      placeholder="예: 50000"
                      onChange={(value) => {
                        markBudgetTouched("매매");
                        setSalePrice(value);
                      }}
                      onConfirm={setConfirmedSalePrice}
                    />
                  )}
                </div>
              </div>
          )}

          {openFilterMenu === "roomSize" && (
            <BudgetMaxControl
              title="방 크기"
              subtitle="최소 평수를 설정해요"
              value={roomSize}
              minLimit={3}
              maxLimit={30}
              step={1}
              unit="평"
              badgeText={`${roomSize}평 이상`}
              inputLabel="최소 평수"
              minLabel="3평"
              maxLabel="30평+"
              placeholder="예: 10"
              onChange={(value) => {
                setRoomSize(value);
                setIsRoomSizeTouched(true);
              }}
              onConfirm={setConfirmedRoomSize}
            />
          )}

          {openFilterMenu === "rooms" && (
            <div className="grid gap-2 grid-cols-4">
              {ROOM_COUNTS.map((item) => {
                const isSelected = selectedRooms.includes(item);

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleOption(item, setSelectedRooms)}
                    className={pillClass(isSelected)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          )}

          {openFilterMenu === "approvalDate" && (
            <div className="grid gap-2 grid-cols-4">
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
              })}
            </div>
          )}
        </div>
      )}

      {/* 선택한 조건 */}
      <div
        className={`${isCollapsed ? "mt-3" : "mt-4"
          } rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5">
            {!isCollapsed && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-900">
                <Search size={20} strokeWidth={2.5} />
              </span>
            )}

            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <p className="shrink-0 text-sm font-extrabold text-slate-900">
                선택한 조건
              </p>

              {!isCollapsed && (
                <p className="min-w-0 text-xs font-medium text-gray-500">
                  적용 중인 필터를 한눈에 확인하세요.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={resetSelectedConditions}
            disabled={!hasSelectedConditions}
            className="shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            조건 초기화
          </button>
        </div>

        <div
          className={`${isCollapsed
            ? "mt-2 border-0 bg-transparent px-0 py-0"
            : "mt-4 border border-gray-100 bg-gray-50 px-3 py-3"
            } flex min-h-9 flex-wrap items-center gap-2 rounded-xl text-xs`}
        >
          {selectedRegions.length > 0 && (
            <span className={conditionTagClass}>
              지역: {getRegionConditionText()}
            </span>
          )}

          {selectedRoomTypes.length > 0 && (
            <span className={conditionTagClass}>
              매물 유형: {selectedRoomTypes.join(", ")}
            </span>
          )}

          {selectedTradeTypes.length > 0 && (
            <span className={conditionTagClass}>
              거래 유형: {selectedTradeTypes.join(", ")}
            </span>
          )}

          {isBudgetTouched && selectedTradeTypes.includes("월세") && (
            <>
              <span className={conditionTagClass}>
                월세 보증금:{" "}
                {confirmedMonthlyDeposit >= 20000
                  ? "무제한"
                  : formatKoreanMoney(confirmedMonthlyDeposit)}{" "}
                이하
              </span>

              <span className={conditionTagClass}>
                월세:{" "}
                {confirmedMonthlyRent >= 150
                  ? "무제한"
                  : `${confirmedMonthlyRent}만원`}{" "}
                이하
              </span>
            </>
          )}

          {isBudgetTouched && selectedTradeTypes.includes("전세") && (
            <span className={conditionTagClass}>
              전세금:{" "}
              {confirmedLeaseDeposit >= 20000
                ? "무제한"
                : formatKoreanMoney(confirmedLeaseDeposit)}{" "}
              이하
            </span>
          )}

          {isBudgetTouched && selectedTradeTypes.includes("매매") && (
            <span className={conditionTagClass}>
              매매가:{" "}
              {confirmedSalePrice >= 500000
                ? "무제한"
                : formatKoreanMoney(confirmedSalePrice)}{" "}
              이하
            </span>
          )}

          {isRoomSizeTouched && (
            <span className={conditionTagClass}>
              방 크기: {confirmedRoomSize}평 이상
            </span>
          )}

          {selectedRooms.length > 0 && (
            <span className={conditionTagClass}>
              방 개수: {selectedRooms.join(", ")}
            </span>
          )}

          {selectedApprovalDate && (
            <span className={conditionTagClass}>
              사용승인일: {selectedApprovalDate}
            </span>
          )}

          {!hasSelectedConditions && (
            <span className="text-sm font-medium text-gray-400">
              아직 선택한 조건이 없습니다.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

