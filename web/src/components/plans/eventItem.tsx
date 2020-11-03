import React from "react";

import { useContext, useState } from "react";
import { createEventItem } from "../../firebase/functions/plans";
import { DotIcon } from "../Icons";
import { SetLoadingContext } from "../utils/Loading/LoadingModal";

import "./eventItem.scss";

export const EventItemListComponent = (props: { eventItems: EventItem[] }) => {
  const { eventItems } = props;
  return (
    <div id="event-item-list-component">
      {eventItems
        .sort((prev, next) => prev.createTime - next.createTime)
        .map((eventItem) => (
          <EventItemComponent eventItem={eventItem} />
        ))}
    </div>
  );
};

export const EventItemComponent = (props: { eventItem: EventItem }) => {
  return (
    <div id="event-item-component">
      <DotIcon />
      <p>{props.eventItem.content}</p>
    </div>
  );
};

export const AddEventItemComponent = (props: {
  planItemId: string;
  eventItem?: EventItem;
  isMouseHover?: boolean;
  onEventAdded: () => void;
}) => {
  const { planItemId } = props;

  const [content, setContent] = useState("");
  const [isFocused, setFocused] = useState(false);

  const setLoading = useContext(SetLoadingContext)!;
  const onSubmit = () => {
    setLoading({
      activated: true,
      icon: "travel",
      message: "Adding Event Item",
    });
    createEventItem({ content, planItemId }).then(() => {
      setContent("");
      setLoading({ activated: false });
      props.onEventAdded();
    });
  };

  const isDisplaying = (): boolean => {
    return props.isMouseHover === true || content != "" || isFocused;
  };

  return (
    <div
      id="add-event-item-component"
      className={isDisplaying() ? "activated" : ""}
    >
      <input
        value={content}
        placeholder="...Adding event here"
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          }
        }}
      />
    </div>
  );
};
