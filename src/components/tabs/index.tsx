import { FC, ReactElement, useState } from "react"
import { tv } from 'tailwind-variants';

export type Tab = {
  name: string;
  icon: ReactElement;
  value: string;
  active: boolean;
}

type TabsProps = {
  data: Tab[];
  onClick: (event: Tab) => void
}

const Tabs:FC<TabsProps> = ({ data, onClick }) => {
  const [tabsSelecteds, setTabsSelecteds] = useState<Tab[]>(data)

  const tabTW = tv({
    base: "flex gap-1 cursor-pointer p-1 items-center dark:text-gray-400",
    variants: {
      active: {
        true: "font-normal",
        false: "font-normal text-gray-400"
      }
    }
  })

  const handlerClick = (tabsSelected: Tab) => {
    const newTabsSelecteds = data.map((tab: Tab) => {
      if (tab.name === tabsSelected.name) {
        return tabsSelected
      }
      return {
        ...tab,
        active: false
      }
    })
    setTabsSelecteds(newTabsSelecteds)
    onClick(tabsSelected)
  }

  return (
    <div className="flex gap-8 border-b-[1px] border-[#e5e7eb] w-full py-1">
      { tabsSelecteds.map((item: Tab) => {
        const { icon, name, active } = item
        return (
          <div key={item.name} onClick={() => handlerClick({ ...item, active: true })} className={tabTW({ active })}>
            { icon }
            <span>{name}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Tabs