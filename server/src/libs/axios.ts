import axios from "axios";

import { env } from "../config/env";

const apiUsingNow = axios.create({
  baseURL: `http://localhost:${env.port}`,
  timeout: 100000,
});

export const listClientMail = async () => {
  const { data } = await apiUsingNow.get<string[]>("clients");

  return data;
};
