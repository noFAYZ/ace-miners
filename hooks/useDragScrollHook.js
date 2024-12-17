import { useEffect } from "react";

export const useDragScrollHook = (scrollDivRef) => {
  useEffect(() => {
    const slider = scrollDivRef?.current;
    let mouseDown = false;
    let startX, startY, scrollLeft, scrollTop;

    let startDragging = function (e) {
      slider.classList.add("cursor-grabbing");
      mouseDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;

      startY = e.pageY - slider.offsetTop;
      scrollTop = slider.scrollTop;
    };
    let stopDragging = function (event) {
      slider.classList.remove("cursor-grabbing");
      mouseDown = false;
    };

    if (window.innerWidth > 1199 && slider) {
      slider.classList.add("cursor-grab");
      slider.addEventListener("mousemove", (e) => {
        e.preventDefault();
        if (!mouseDown) {
          return;
        }
        const x = e.pageX - slider.offsetLeft;
        const scroll_x = x - startX;
        slider.scrollLeft = scrollLeft - scroll_x;

        const y = e.pageY - slider.offsetTop;
        const scroll_y = y - startY;
        slider.scrollTop = scrollTop - scroll_y;
      });

      // Add the event listeners
      slider.addEventListener("mousedown", startDragging, false);
      slider.addEventListener("mouseup", stopDragging, false);
      slider.addEventListener("mouseleave", stopDragging, false);
    }

    return () => {
      if (window.innerWidth > 1199 && slider) {
        slider.removeEventListener("mousedown", startDragging, false);
        slider.removeEventListener("mouseup", stopDragging, false);
        slider.removeEventListener("mouseleave", stopDragging, false);
      }
    };
  }, []);
};
