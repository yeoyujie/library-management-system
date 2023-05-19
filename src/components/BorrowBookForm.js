import React, { useState } from "react";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "../firebase_setup/firebase.js";
import Form from "./Form";
import LayoutForm from "./LayoutForm";
import { useTransition, animated } from "react-spring";
