import { FC, useState } from "react"
import { tv } from 'tailwind-variants';

export type SwitchProps = {
  status: boolean | undefined
}

const switchTW = tv({
  base: "flex p-1 cursor-pointer w-[50px] border-[1px] border-[#ccc] transition rounded-[30px]",
  variants: {
    status: {
      true: "justify-start",
      false: "justify-end"
    }
  }
})

const Switch:FC<SwitchProps> = () => {
  const [selected, setSelected] = useState<boolean>(true)

  const handlerSelected = (selected: boolean) => {
    setSelected(!selected)
    if (selected) {
      document.querySelector("html")?.classList.add("dark")
      return
    }
    document.querySelector("html")?.classList.remove("dark")
  }

  return (
    <div className={switchTW({ status: selected })} onClick={() => handlerSelected(selected)}>
      <div className="h-3 w-3 bg-black rounded-lg dark:bg-white">

      </div>
    </div>
  )
}

export default Switch