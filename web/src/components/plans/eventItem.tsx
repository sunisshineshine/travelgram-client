import React, { useContext, useState } from "react";
import { createEventItem } from "../../firebase/functions/plans";
import { LoadingStateContext } from "../utils/Loading/LoadingModal";

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
  return <div id="event-item-component">✈️ {props.eventItem.content}</div>;
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

  const setLoading = useContext(LoadingStateContext)![1];
  const onSubmit = () => {
    console.log(content);
    setLoading({
      activated: true,
      icon: "travel",
      message: "Adding Event Item",
    });
    createEventItem({ content, planItemId }).then((result) => {
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
      <div className="flex-row">
        <p
          className="icon"
          style={{ fontSize: "16px", paddingBottom: "2px", width: "20px" }}
        >
          ＋
        </p>
        <input
          value={content}
          placeholder="adding event here"
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
    </div>
  );
};
