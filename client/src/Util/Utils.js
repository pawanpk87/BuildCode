import slug from "slug";

export const reservedName = [
  "help-center",
  "disclaimer",
  "privacy-policy",
  "terms-and-conditions",
  "aboutUs",
  "verify-email",
  "FAQ",
  "articles",
  "completed-projects",
  "ongoing-projects",
  "requested-projects",
  "project-request",
  "write",
  "how-to-make-project",
  "what-is-project-request",
];

export function getBuildCodePic(firstCharacter) {
  return `https://firebasestorage.googleapis.com/v0/b/buildcode-db.appspot.com/o/BuildCode%2Fusers%2F${firstCharacter}.png?alt=media&token=01a9115b-909e-4541-944e-b853be831003`;
}

export function isLetter(str) {
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (format.test(str)) {
    return false;
  }
  return str.length === 1 && str.match(/[a-z]/i);
}

export function generateURLName(name) {
  return slug(name, {
    replacement: "-",
    remove: undefined,
    lower: false,
    strict: false,
    locale: "vi",
    trim: true,
  });
}

export function generatedKeyWordsForWebSearch(str) {
  let keywords = [];

  const items = str.split(" ");
  const result = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = 1; j <= items.length; j++) {
      const slice = items.slice(i, j);
      if (slice.length) result.push(slice.join(" "));
    }
  }

  keywords = [...result];

  return keywords;
}

export function generateKeyWordsForUsers(userName) {
  let tempTitle = userName;
  let keywords = [userName.toLowerCase(), userName.toUpperCase(), userName];

  if (userName.split().length > 0) {
    let newUserNameArray = userName.split(" ");
    for (let i = 0; i < newUserNameArray.length; i++) {
      let tempUserName = newUserNameArray[i];
      for (let index = 1; index <= tempUserName.length; index++) {
        keywords.push(tempUserName.substring(0, index));
      }
      tempUserName = tempUserName.toLowerCase();
      for (let index = 1; index <= tempUserName.length; index++) {
        keywords.push(tempUserName.substring(0, index));
      }
    }
  } else {
    for (let index = 1; index <= userName.length; index++) {
      keywords.push(userName.substring(0, index));
    }
    userName = userName.toLowerCase();
    for (let index = 1; index <= userName.length; index++) {
      keywords.push(userName.substring(0, index));
    }
  }

  const items1 = tempTitle.split(" ");
  const result1 = [];
  for (let i = 0; i < items1.length; i++) {
    for (let j = 1; j <= items1.length; j++) {
      const slice = items1.slice(i, j);
      if (slice.length) result1.push(slice.join(" "));
    }
  }

  const items2 = tempTitle.toLowerCase().split(" ");
  const result2 = [];
  for (let i = 0; i < items2.length; i++) {
    for (let j = 1; j <= items2.length; j++) {
      const slice = items2.slice(i, j);
      if (slice.length) result2.push(slice.join(" "));
    }
  }

  keywords = [...keywords, ...result1, ...result2];

  return keywords;
}

export function generateKeyWords(title, technology, tags) {
  let tempTitle = title;
  let keywords = [technology.toLowerCase(), technology, ...tags];

  if (title.split().length > 0) {
    let newTititleArray = title.split(" ");
    for (let i = 0; i < newTititleArray.length; i++) {
      let title = newTititleArray[i];
      for (let index = 1; index <= title.length; index++) {
        keywords.push(title.substring(0, index));
      }
      title = title.toLowerCase();
      for (let index = 1; index <= title.length; index++) {
        keywords.push(title.substring(0, index));
      }
    }
  } else {
    for (let index = 1; index <= title.length; index++) {
      keywords.push(title.substring(0, index));
    }
    title = title.toLowerCase();
    for (let index = 1; index <= title.length; index++) {
      keywords.push(title.substring(0, index));
    }
  }

  const items1 = tempTitle.split(" ");
  const result1 = [];
  for (let i = 0; i < items1.length; i++) {
    for (let j = 1; j <= items1.length; j++) {
      const slice = items1.slice(i, j);
      if (slice.length) result1.push(slice.join(" "));
    }
  }

  const items2 = tempTitle.toLowerCase().split(" ");
  const result2 = [];
  for (let i = 0; i < items2.length; i++) {
    for (let j = 1; j <= items2.length; j++) {
      const slice = items2.slice(i, j);
      if (slice.length) result2.push(slice.join(" "));
    }
  }

  keywords = [...keywords, ...result1, ...result2];

  return keywords;
}

export function generateKeyWordsForArticles(title, articleTags, cmp) {
  let tempTitle = title;
  let keywords = [];

  if (title.split().length > 0) {
    let newTititleArray = title.split(" ");
    for (let i = 0; i < newTititleArray.length; i++) {
      let title = newTititleArray[i];
      for (let index = 1; index <= title.length; index++) {
        keywords.push(title.substring(0, index));
      }
      title = title.toLowerCase();
      for (let index = 1; index <= title.length; index++) {
        keywords.push(title.substring(0, index));
      }
    }
  } else {
    for (let index = 1; index <= title.length; index++) {
      keywords.push(title.substring(0, index));
    }
    title = title.toLowerCase();
    for (let index = 1; index <= title.length; index++) {
      keywords.push(title.substring(0, index));
    }
  }

  const items1 = tempTitle.split(" ");
  const result1 = [];
  for (let i = 0; i < items1.length; i++) {
    for (let j = 1; j <= items1.length; j++) {
      const slice = items1.slice(i, j);
      if (slice.length) result1.push(slice.join(" "));
    }
  }

  const items2 = tempTitle.toLowerCase().split(" ");
  const result2 = [];
  for (let i = 0; i < items2.length; i++) {
    for (let j = 1; j <= items2.length; j++) {
      const slice = items2.slice(i, j);
      if (slice.length) result2.push(slice.join(" "));
    }
  }

  keywords = [...keywords, ...result1, ...result2, ...articleTags, ...cmp];

  return keywords;
}

export function generateKeyWordsForSkill(skill) {
  let keywords = [];
  if (skill.split().length > 0) {
    let newSkillArray = skill.split(" ");
    for (let i = 0; i < newSkillArray.length; i++) {
      let skl = newSkillArray[i];
      for (let index = 1; index <= skl.length; index++) {
        keywords.push(skl.substring(0, index));
      }
      skl = skl.toLowerCase();
      for (let index = 1; index <= skl.length; index++) {
        keywords.push(skl.substring(0, index));
      }
    }
  } else {
    for (let index = 1; index <= skill.length; index++) {
      keywords.push(skill.substring(0, index));
    }
    skill = skill.toLowerCase();
    for (let index = 1; index <= skill.length; index++) {
      keywords.push(skill.substring(0, index));
    }
  }
  return keywords;
}

export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
