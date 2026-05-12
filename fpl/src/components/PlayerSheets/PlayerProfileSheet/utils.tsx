import { IElement } from "core-integration/src/store/elements/types";
import { integerToMoney } from "core-integration/src/utils/money";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import { ReactNode } from "react";
import { getShortNameFromId } from "../../../utils/events";
import { statDetails } from "../../../utils/stats";

export type StatItemType = {
  id: string;
  title: ReactNode;
  value?: string | number;
  rankType?: number | null;
};

const { form, ict_index, selected_by_percent } = statDetails;

export const getStatItems = ({
  element,
  eventId,
}: {
  element: IElement;
  eventId: number | null;
}): StatItemType[] => [
  {
    id: "now_cost",
    title: "Price",
    value: `£${integerToMoney(element.now_cost, 10)}m`,
    rankType: element.now_cost_rank_type,
  },
  {
    id: "form",
    title: (
      <InfoText label={form.label} tooltipText={form.description}>
        Form
      </InfoText>
    ),
    value: element.form,
  },
  {
    id: "points_per_game",
    title: "Pts / Match",
    value: element.points_per_game,
    rankType: element.points_per_game_rank_type,
  },
  {
    id: "event_points",
    title: eventId ? `${getShortNameFromId(eventId)} Pts` : "",
    value: element.event_points,
  },
  {
    id: "total_points",
    title: "Total Pts",
    value: element.total_points,
  },
  ...(element.element_type !== 5
    ? [
        {
          id: "bonus",
          title: "Total Bonus",
          value: element.bonus,
        },
        {
          id: "ict_index",
          title: (
            <>
              <span style={{ display: "inline-block" }}>
                <InfoText
                  label={ict_index.label}
                  tooltipText={ict_index.description}
                >
                  {statDetails.ict_index.shortName}
                </InfoText>
              </span>{" "}
              Index
            </>
          ),
          value: element.ict_index,
          rankType: element.ict_index_rank_type,
        },
      ]
    : []),
  {
    id: "selected_by_percent",
    title: (
      <span>
        <span style={{ display: "inline-block" }}>
          <InfoText
            label={selected_by_percent.label}
            tooltipText={selected_by_percent.description}
          >
            {statDetails.selected_by_percent.shortName}
          </InfoText>
        </span>{" "}
        %
      </span>
    ),
    value: `${element.selected_by_percent}%`,
    rankType: element.selected_rank_type,
  },
];

export const getRankTypeString = ({
  rankType,
  elementCount,
}: {
  rankType?: number | null;
  elementCount: number;
}) => {
  if (rankType == null) return undefined;

  return `${rankType} of ${elementCount}`;
};
