export function notify(message, isError = false) {
  let box = document.querySelector("#notification");

  if (!box) {
    box = document.createElement("p");
    box.id = "notification";
    box.setAttribute("role", "status");
    box.setAttribute("aria-live", "polite");

    document.querySelector("main").append(box);
  }

  box.textContent = message;
  box.classList.toggle("error", isError);
}