export type ValueType = "number" | "null";

export interface RuntimeValue {
  type: ValueType;
}

export interface NumericValue extends RuntimeValue {
  type: "number";
  value: number;
}

export interface NullValue extends RuntimeValue {
  type: "null";
  value: "null";
}
