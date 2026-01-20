const STORAGE_KEY = "zenmali_members";

const $ = (selector) => document.querySelector(selector);

const loadMembers = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveMembers = (members) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
};

const renderMembers = () => {
  const table = $("#member-table tbody");
  if (!table) {
    return;
  }
  const members = loadMembers();
  table.innerHTML = "";

  if (members.length === 0) {
    table.innerHTML = "<tr><td colspan='6'>Kayıt bulunamadı.</td></tr>";
    return;
  }

  members.forEach((member) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.firstName} ${member.lastName}</td>
      <td>${member.hasCompany === "yes" ? "Evet" : "Hayır"}</td>
      <td>${member.taxNumber || "-"}</td>
      <td>${member.email}</td>
      <td>${member.phone}</td>
      <td>${member.createdAt}</td>
    `;
    table.appendChild(row);
  });
};

const setupTabs = () => {
  const tabs = document.querySelectorAll(".tab-button");
  const loginTab = $("#login-tab");
  const registerTab = $("#register-tab");

  if (!tabs.length || !loginTab || !registerTab) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((button) => button.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      loginTab.classList.toggle("hidden", target !== "login");
      registerTab.classList.toggle("hidden", target !== "register");
    });
  });
};

const setupCompanyField = () => {
  const hasCompany = $("#has-company");
  const taxField = $("#tax-number-field");
  const taxInput = $("#tax-number");

  if (!hasCompany || !taxField || !taxInput) {
    return;
  }

  const toggleTaxField = () => {
    const isCompany = hasCompany.value === "yes";
    taxField.classList.toggle("hidden", !isCompany);
    taxInput.required = isCompany;
  };

  hasCompany.addEventListener("change", toggleTaxField);
  toggleTaxField();
};

const setupRegister = () => {
  const form = $("#register-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const members = loadMembers();

    const member = {
      firstName: formData.get("firstName").trim(),
      lastName: formData.get("lastName").trim(),
      hasCompany: formData.get("hasCompany"),
      taxNumber: formData.get("taxNumber")?.trim(),
      email: formData.get("email").trim(),
      phone: formData.get("phone").trim(),
      createdAt: new Date().toLocaleString("tr-TR"),
    };

    members.unshift(member);
    saveMembers(members);
    form.reset();
    setupCompanyField();
    alert("Üyelik başarıyla kaydedildi.");
  });
};

const setupLogin = () => {
  const form = $("#login-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = formData.get("email").trim();
    const phone = formData.get("phone").trim();
    const members = loadMembers();

    const match = members.find(
      (member) => member.email === email && member.phone === phone
    );

    if (match) {
      alert(`Hoş geldiniz, ${match.firstName} ${match.lastName}.`);
    } else {
      alert("Giriş yapılamadı. Lütfen kayıt bilgilerinizi kontrol edin.");
    }
  });
};

setupTabs();
setupCompanyField();
setupRegister();
setupLogin();
renderMembers();
