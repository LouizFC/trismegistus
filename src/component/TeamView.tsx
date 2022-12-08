import { Root as AccordionRoot } from "@radix-ui/react-accordion";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { IconAdjustmentsHorizontal, IconPlayerPlay } from "@tabler/icons";
import { useCallback, useMemo, useState } from "react";

import { MemberSlotView } from "@/component/MemberSlotView";
import { MysticCodeView } from "@/component/MysticCodeView";
import { TeamContext } from "@/hook/useTeamContext";
import { useSelector } from "@/store";
import { selectTeamServantSlots } from "@/store/entity/servant";
import { MemberSlot, TeamContextData, TeamViewMode } from "@/types";
import { nextMemberSlot } from "@/types/utils";

function useSlotData(teamId: number, mode: TeamViewMode): TeamContextData[] {
  const slots = useSelector(selectTeamServantSlots(teamId));

  return useMemo(() => {
    const next =
      slots.length > 0
        ? nextMemberSlot(slots[slots.length - 1])
        : MemberSlot.FIELD_1;

    return [
      { teamId, slot: MemberSlot.NONE, mode },
      ...(next != null && mode === TeamViewMode.EDIT
        ? [...slots, next]
        : slots
      ).map((slot) => ({ teamId, mode, slot })),
    ];
  }, [teamId, slots, mode]);
}

export interface TeamCompViewProps {
  teamId: number;
}

export function TeamView({ teamId }: TeamCompViewProps) {
  const [mode, setMode] = useState<TeamViewMode>(TeamViewMode.VIEW);
  const [mysticCode, ...member] = useSlotData(teamId, mode);

  const handleModeChange = useCallback(
    (value: string) => {
      setMode(value !== "" ? (value as TeamViewMode) : TeamViewMode.VIEW);
    },
    [setMode]
  );

  return (
    <section className="flex flex-col items-start">
      <ToggleGroup.Root
        type="single"
        value={mode}
        onValueChange={handleModeChange}
      >
        <ToggleGroup.Item
          value={TeamViewMode.EDIT}
          className="radix-state-on:text-primary-700"
        >
          <IconAdjustmentsHorizontal /> Edit Team
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value={TeamViewMode.SCRIPT}
          className="radix-state-on:text-primary-700"
        >
          <IconPlayerPlay /> Battle Script
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <AccordionRoot type="single" className="flex flex-col" collapsible>
        {member.map((contextData) => (
          <TeamContext.Provider key={contextData.slot} value={contextData}>
            <MemberSlotView />
          </TeamContext.Provider>
        ))}
        <TeamContext.Provider value={mysticCode}>
          <MysticCodeView />
        </TeamContext.Provider>
      </AccordionRoot>
    </section>
  );
}
