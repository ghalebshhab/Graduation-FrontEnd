// Sample data for Mohammad Zarour (Screen 1 style)
export const myProfileData = {
  name: "Mohammad Zarour",
  location: "الأردن",
  bio: "مستكشف الأردن 🇯🇴 | أحب السفر والتصوير 📸",
  profilePic: "/path-to-mohammad.jpg", // Replace with your actual image path
  stats: {
    posts: 2,
    followers: "2.5k",
    following: 180,
  },
  friends: [
    { id: 1, name: "Mousab", img: "/path-to-mousab.jpg" },
    { id: 2, name: "Abdalqader", img: "/path-to-abdalqader.jpg" },
    { id: 3, name: "Ghaleb", img: "/path-to-ghaleb.jpg" },
    { id: 4, name: "Eyad", img: "/path-to-eyad.jpg" },
    { id: 5, name: "Ziad", img: "/path-to-ziad.jpg" },
  ],
  recentPosts: [
    {
      id: 101,
      image: "/path-to-wadi-rum.jpg",
      tag: "أنت",
      caption: "رحلة إلى وادي رم",
    },
  ],
};

// Sample data for Ziad Qafisheh (Screen 2 style)
export const friendProfileData = {
  name: "Ziad Qafisheh",
  location: "Amman, Jordan",
  bio: "☕️ مطور تطبيقات أندرويد | مسافر | محب القهوة 🌍",
  profilePic: "/path-to-ziad.jpg",
  stats: {
    posts: 49,
    followers: 1148,
    following: 240,
  },
  recentPosts: [
    {
      id: 201,
      image: "/path-to-varna.jpg",
      tag: "USER",
      caption: "9 days ago",
    },
  ],
};

// This line solves the "does not provide an export named default" error
export default myProfileData;
