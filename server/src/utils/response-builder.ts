import httpStatus from "http-status";

export const responseBuilder = (code: number, data: any, context: string) => {
  return {
    success: true,
    data,
    code,
    context,
  };
};
