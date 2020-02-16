const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // admin sends invitation with just the email and the role (default: user)
    email: { type: String, require: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
      require: true
    },
    activatedAt: { type: Date },
    activated: { type: Boolean, default: false }, // time when the user logged in the first time and saved his Name and Surname
    loggedIn: { type: Boolean, default: false }, //optional
    jobsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ],
    favJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: "Job"
      }
    ],
    profile: {
      name: { type: String },
      surname: { type: String },
      portfolio: String, // has to start with https:// | http:// AND end with .*** :
      course: { type: String, enum: ["Data", "UX/UI", "WebDev"] },
      batch: {
        month: String,
        year: Number
      },
      // minor important attributes
      image: { type: String, default: "/images/profile/no-image.jpg" },

      techStack: [
        {
          category: String,
          rate: { type: Number, enum: [1, 2, 3, 4, 5] }
        }
      ],

      cv: [
        {
          jobTitle: String,
          company: String,
          companyUrl: String,
          startDate: { type: Date },
          endDate: { type: Date },
          current: Boolean
        }
      ],
      searchFor: {
        type: String,
        enum: [
          "part time job",
          "full time job",
          "collaboration",
          "employees",
          "freelance",
          "don't know"
        ]
      }
    }

    // user definitely has to set (not required in the schema, just in the form validation):
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("User", userSchema);
