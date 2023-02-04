import React from "react";


const useRipple = () => {
  return (e: React.MouseEvent<HTMLButtonElement>) => {
    const element = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - element.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - element.offsetTop - radius}px`;
    circle.classList.add('ripple');

    element.appendChild(circle);
    setTimeout(() => {
      const ripple = element.getElementsByClassName('ripple')[0];
      if (ripple) {
        ripple.remove();
      }
    }, 500)
  }
}

export default useRipple;