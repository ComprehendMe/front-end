import { Tabs, TabsList, TabsTrigger } from "@/components/dashboard/ui/tabs";
import {
  useLocation,
  useNavigate,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { useRef } from "react";

interface ListProps {
  tabs: {
    name: string;
    icon?: React.ReactElement;
    value: string;
  }[];
  url: string;
  searchParamName?: string;
  disabled?: boolean;
}

export function ListTab({ tabs, url, searchParamName, disabled }: ListProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const search = useSearch({
    strict: false,
    select: (search) => search as Record<string, string | undefined>,
  });

  const ref = useRef<HTMLDivElement | null>(null);

  function handleChange(value: string) {
    if (!searchParamName) {
      navigate({
        to: `${url}/${value}`,
        search: location.search,
      });
      return;
    }

    navigate({
      to: url,
      search: (prev) => ({
        ...prev,
        [searchParamName]: value || undefined,
      }),
      replace: Boolean(search),
    });
  }

  const defaultValue = searchParamName
    ? search[searchParamName]
    : tabs[0].value;

  return (
    <div className="w-full max-w-md">
      <Tabs
        className="flex-row"
        defaultValue={defaultValue ?? tabs[0].value}
        onValueChange={handleChange}
      >
        <TabsList ref={ref} className="bg-background h-full flex-col">
          {tabs.map((tab) => (
            <TabsTrigger className="w-full justify-start"  key={tab.value} value={tab.value} disabled={disabled}>
              {tab.icon}
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
