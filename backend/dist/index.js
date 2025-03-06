"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// api/server.ts
var import_express3 = __toESM(require("express"));
var import_body_parser = require("body-parser");
var import_morgan = __toESM(require("morgan"));
var import_cors = __toESM(require("cors"));

// api/routes/user.route.ts
var import_express = require("express");

// api/services/user.service.ts
var import_lodash = require("lodash");

// api/models/user.model.ts
var import_mongoose = __toESM(require("mongoose"));
var import_bcryptjs = __toESM(require("bcryptjs"));
var userSchema = new import_mongoose.default.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" }
  },
  {
    timestamps: true
  }
);
userSchema.pre("save", async function(next) {
  let user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await import_bcryptjs.default.genSalt(10);
  const hash = await import_bcryptjs.default.hashSync(user.password, salt);
  user.password = hash;
  return next();
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  const user = this;
  return import_bcryptjs.default.compare(candidatePassword, user.password).catch((e) => false);
};
var userModel = import_mongoose.default.model("User", userSchema);
var user_model_default = userModel;

// api/services/user.service.ts
async function createUser(input) {
  try {
    const user = await user_model_default.create(input);
    return (0, import_lodash.omit)(user.toJSON(), "password");
  } catch (e) {
    throw new Error(e);
  }
}
async function validatePassword({
  email,
  password
}) {
  const user = await user_model_default.findOne({ email });
  if (!user) {
    return false;
  }
  const isValid = await user.comparePassword(
    password
  );
  if (!isValid) return false;
  return (0, import_lodash.omit)(user.toJSON(), "password");
}
async function findUser(query) {
  return user_model_default.findOne(query).lean();
}

// api/utils/logger.ts
var import_pino = __toESM(require("pino"));
var log = (0, import_pino.default)({
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${(/* @__PURE__ */ new Date()).toISOString()}"`
});
var logger_default = log;

// api/controllers/user.controller.ts
async function createUserHandler(req, res) {
  try {
    const user = await createUser(req.body);
    return res.status(201).send(user);
  } catch (e) {
    logger_default.error(e);
    return res.status(409).send(e.message);
  }
}
async function getCurrentUser(req, res) {
  return res.send(res.locals.user);
}

// api/middleware/deserializeUser.ts
var import_lodash3 = require("lodash");

// api/utils/jwt.utils.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var privateKey = process.env.PRIVATE_KEY;
var publicKey = process.env.PUBLIC_KEY;
function signJwt(object3, options) {
  return import_jsonwebtoken.default.sign(object3, privateKey, {
    ...options && options,
    algorithm: "RS256"
  });
}
function verifyJwt(token) {
  try {
    const decoded = import_jsonwebtoken.default.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded
    };
  } catch (e) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null
    };
  }
}

// api/services/session.service.ts
var import_lodash2 = require("lodash");

// api/models/session.model.ts
var import_mongoose2 = __toESM(require("mongoose"));
var sessionSchema = new import_mongoose2.default.Schema(
  {
    user: { type: import_mongoose2.default.Schema.Types.ObjectId, ref: "User" },
    valid: { type: Boolean, default: true },
    userAgent: { type: String }
  },
  {
    timestamps: true
  }
);
var SessionModel = import_mongoose2.default.model("Session", sessionSchema);
var session_model_default = SessionModel;

// api/services/session.service.ts
var import_dotenv2 = __toESM(require("dotenv"));
import_dotenv2.default.config();
var accessTokenTtl = process.env.ACCESS_TOKEN_TTL;
async function createSession(userId, userAgent) {
  const session = await session_model_default.create({ user: userId, userAgent });
  return session.toJSON();
}
async function findSessions(query) {
  return session_model_default.find(query).lean();
}
async function updateSession(query, update) {
  return session_model_default.updateOne(query, update);
}
async function reIssueAccessToken({
  refreshToken
}) {
  const { decoded } = verifyJwt(refreshToken);
  if (!decoded || !(0, import_lodash2.get)(decoded, "session")) return false;
  const session = await session_model_default.findById((0, import_lodash2.get)(decoded, "session"));
  if (!session || !session.valid) return false;
  const user = await findUser({ _id: session.user });
  if (!user) return false;
  const accessToken = signJwt({ ...user, session: session._id }, {
    expiresIn: accessTokenTtl
  });
  return accessToken;
}

// api/middleware/deserializeUser.ts
var deserializeUser = async (req, res, next) => {
  const accessToken = (0, import_lodash3.get)(req, "cookies.accessToken") || (0, import_lodash3.get)(req, "headers.authorization", "").replace(/^Bearer\s/, "");
  const refreshToken = (0, import_lodash3.get)(req, "cookies.refreshToken") || (0, import_lodash3.get)(req, "headers.x-refresh");
  if (!accessToken) {
    return next();
  }
  const { decoded, expired } = verifyJwt(accessToken);
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }
  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      res.cookie("accessToken", newAccessToken, {
        maxAge: 9e5,
        // 15 mins
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false
      });
    }
    const result = verifyJwt(newAccessToken);
    res.locals.user = result.decoded;
    return next();
  }
  return next();
};
var deserializeUser_default = deserializeUser;

// api/middleware/requireUser.ts
var requireUser = (req, res, next) => {
  const user = res.locals.user;
  if (!user) {
    return res.sendStatus(403);
  }
  return next();
};
var requireUser_default = requireUser;

// api/schemas/user.schema.ts
var import_zod = require("zod");
var createUserSchema = (0, import_zod.object)({
  body: (0, import_zod.object)({
    fullName: (0, import_zod.string)({
      required_error: "Full name is required"
    }),
    password: (0, import_zod.string)({
      required_error: "Password is required"
    }).min(6, "Password too short - should be 6 chars minimum"),
    passwordConfirmation: (0, import_zod.string)({
      required_error: "passwordConfirmation is required"
    }),
    email: (0, import_zod.string)({
      required_error: "Email is required"
    }).email("Not a valid email"),
    profilePic: (0, import_zod.string)().optional()
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"]
  })
});

// api/middleware/validateResource.ts
var validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (e) {
    return res.status(400).send(e.errors);
  }
};
var validateResource_default = validate;

// api/routes/user.route.ts
var router = (0, import_express.Router)();
router.post("/", validateResource_default(createUserSchema), createUserHandler);
router.get("/me", deserializeUser_default, requireUser_default, getCurrentUser);
var user_route_default = router;

// api/routes/session.route.ts
var import_express2 = require("express");

// api/controllers/session.controller.ts
var accessTokenTtl2 = process.env.ACCESS_TOKEN_TTL;
var refreshTokenTtl = process.env.REFRESH_TOKEN_TTL;
async function createUserSessionHandler(req, res) {
  const user = await validatePassword(req.body);
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  const session = await createSession(
    user._id.toString(),
    req.get("user-agent") || ""
  );
  const accessToken = signJwt({ ...user, session: session._id }, {
    expiresIn: accessTokenTtl2
  });
  const refreshToken = signJwt({ ...user, session: session._id }, {
    expiresIn: refreshTokenTtl
  });
  res.cookie("accessToken", accessToken, {
    maxAge: 9e5,
    // 15 mins
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 3154e7,
    // 1 year
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "strict",
    secure: false
  });
  return res.send({ accessToken, refreshToken });
}
async function getUserSessionsHandler(req, res) {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions);
}
async function deleteSessionHandler(req, res) {
  const sessionId = res.locals.user.session;
  await updateSession({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null
  });
}

// api/schemas/session.schema.ts
var import_zod2 = require("zod");
var createSessionSchema = (0, import_zod2.object)({
  body: (0, import_zod2.object)({
    email: (0, import_zod2.string)({
      required_error: "Email is required"
    }),
    password: (0, import_zod2.string)({
      required_error: "Password is required"
    })
  })
});

// api/routes/session.route.ts
var router2 = (0, import_express2.Router)();
router2.post(
  "/",
  validateResource_default(createSessionSchema),
  createUserSessionHandler
);
router2.get("/", requireUser_default, getUserSessionsHandler);
router2.delete("/", requireUser_default, deleteSessionHandler);
var session_route_default = router2;

// api/server.ts
var import_cookie_parser = __toESM(require("cookie-parser"));
var createServer = () => {
  const app = (0, import_express3.default)();
  app.disable("x-powered-by").use((0, import_morgan.default)("dev")).use((0, import_body_parser.urlencoded)({ extended: true })).use((0, import_body_parser.json)()).use((0, import_cors.default)()).use((0, import_cookie_parser.default)());
  app.get("/ping", (_, res) => {
    res.send("pong \u{1F3D3}");
  });
  app.use("/api/users", user_route_default);
  app.use("/api/sessions", session_route_default);
  return app;
};

// api/utils/connect.ts
var import_mongoose3 = __toESM(require("mongoose"));
async function connect() {
  const dbUri = process.env.MONGODB_URI;
  console.log("dbUri", dbUri);
  if (!dbUri) {
    throw new Error("no MongoDB URI provided");
  }
  try {
    await import_mongoose3.default.connect(dbUri);
    logger_default.info("DB connected");
  } catch (error) {
    logger_default.error("Could not connect to db");
    process.exit(1);
  }
}
var connect_default = connect;

// api/index.ts
var import_dotenv3 = __toESM(require("dotenv"));
import_dotenv3.default.config();
var port = process.env.PORT || 5001;
var server = createServer();
server.listen(port, () => {
  logger_default.info(`api running on ${port}`);
  connect_default();
});
module.exports = server;
