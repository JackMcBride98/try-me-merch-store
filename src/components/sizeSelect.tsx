import { type ProductStockKeepingUnit } from "@prisma/client";
import * as Select from "@radix-ui/react-select";

export type SizeSelectProps = {
  value: string;
  setValue: (value: string) => void;
  options: Array<ProductStockKeepingUnit>;
};

export const SizeSelect = ({ value, setValue, options }: SizeSelectProps) => {
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger className="flex w-40 justify-between bg-white p-1 text-black">
        <Select.Value aria-label={value} className="w-full text-black" />
        <Select.Icon className="text-black" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="w-40 bg-white p-1 text-black"
        >
          <Select.ScrollUpButton />
          <Select.Viewport>
            {options.map((option) => (
              <Select.Item key={option.id} value={option.size}>
                <Select.ItemText> {option.size} </Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
            <Select.Separator />
          </Select.Viewport>
          <Select.ScrollDownButton />
          <Select.Arrow />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
