function isDestination(url: string) {
  return url.includes("/destination/");
}
function isCrew(url: string) {
  return url.includes("/crew/");
}
function isTechnology(url: string) {
  return url.includes("/technology/");
}

export {
  isCrew,
  isDestination,
  isTechnology
}