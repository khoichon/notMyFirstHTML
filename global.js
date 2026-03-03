function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


if (localStorage.getItem("notTheEnd") == "true" && !sessionStorage.getItem("notTheEnd")){
  localStorage.removeItem("notTheEnd");
  window.location.href = "./part6.html";
};