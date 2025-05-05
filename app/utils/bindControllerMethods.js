const bindControllerMethods = (controller) => {
  const prototype = Object.getPrototypeOf(controller);
  const methodNames = Object.getOwnPropertyNames(prototype).filter(
    (name) => typeof controller[name] === "function" && name !== "constructor",
  );

  methodNames.forEach((name) => {
    controller[name] = controller[name].bind(controller);
  });

  return controller;
};

module.exports = bindControllerMethods;
