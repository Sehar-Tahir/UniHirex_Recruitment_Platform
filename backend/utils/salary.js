const MAX_SALARY = 10000000; // per month

const isBlank = (value) => value === undefined || value === null || String(value).trim() === "";
const money = (n) => `PKR ${n.toLocaleString("en-US")}`;

// Accepts a number or numeric text. Only whole numbers from 0 to MAX_SALARY are allowed.
function parseAmount(value, label) {
  if (isBlank(value)) return { blank: true, value: 0 };

  const text = String(value).trim();
  if (!/^\d+$/.test(text)) return { error: `${label} must be a whole number of 0 or more.` };

  const amount = Number(text);
  if (amount > MAX_SALARY) {
    return { error: `${label} can't be more than ${MAX_SALARY.toLocaleString("en-US")} per month.` };
  }
  return { blank: false, value: amount };
}

// The text shown on listings, always built from the validated numbers
function salaryText(min, max, anyProvided, maxBlank) {
  if (!anyProvided) return "Not specified";
  if (max === 0) return "Unpaid";
  if (maxBlank) return `${money(min)}+/mo`;
  if (min === 0) return `Up to ${money(max)}/mo`;
  if (min === max) return `${money(min)}/mo`;
  return `${money(min)} - ${money(max)}/mo`;
}

// Returns { salaryMin, salaryMax, salary } or { error }
function cleanSalary(rawMin, rawMax) {
  const min = parseAmount(rawMin, "Minimum salary");
  if (min.error) return { error: min.error };
  const max = parseAmount(rawMax, "Maximum salary");
  if (max.error) return { error: max.error };

  const salaryMin = min.value;
  const salaryMax = max.blank ? min.value : max.value;
  if (!max.blank && salaryMin > salaryMax) {
    return { error: "Minimum salary can't be greater than maximum salary." };
  }

  const anyProvided = !min.blank || !max.blank;
  return { salaryMin, salaryMax, salary: salaryText(salaryMin, salaryMax, anyProvided, max.blank) };
}

module.exports = { MAX_SALARY, cleanSalary, salaryText };