"use client"

import { useEffect, useState } from "react";
import Link from 'next/link'
import Input from "@/components/input/indext";
import Tabs, { Tab } from "@/components/tabs";
import { User, Book, MapPin, Mail, Globe, GitFork, Star, Copy } from "lucide-react";
import { getUserByName } from "@/services/user";
import { getRepositories } from "@/services/repositories";
import { getFollowers } from "@/services/followers";
import { getFollowing } from "@/services/following";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { format } from "date-fns";
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Switch from "@/components/switch";

const tabs: Tab[] = [
  {
    name: "Repositórios",
    icon: <Book size={16} />,
    value: "repositories",
    active: false
  },
  {
    name: "Seguidores",
    icon: <Book size={16} />,
    value: "followers",
    active: false
  },
  {
    name: "Seguindo",
    icon: <Book size={16} />,
    value: "following",
    active: false
  }
]

const Home = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [tabSelected, setTabSelected] = useState<string>(params.get('tab') || 'repositories');
  const [name, setName] = useState<string | null>(params.get('user'));
  const [tabList, setTabList] = useState<Tab[]>([]);
  const debouncedName = useDebounce(name, 500);

  const pathname = usePathname();
  const { replace } = useRouter();

  const { data } = useQuery({
    queryKey: ["user", debouncedName],
    queryFn: () => getUserByName(debouncedName),
    initialData: null
  })

  const { data: dataRepositories } = useQuery({
    queryKey: ["repositories", debouncedName],
    queryFn: () => getRepositories(debouncedName),
    initialData: null
  })

  const { data: dataFollowers } = useQuery({
    queryKey: ["followers", debouncedName],
    queryFn: () => getFollowers(debouncedName),
    initialData: null
  })

  const { data: dataFollowing } = useQuery({
    queryKey: ["followings", debouncedName],
    queryFn: () => getFollowing(debouncedName),
    initialData: null
  })

  const changeTabsSelected = (event: Tab) => {
    setTabSelected(event.value)
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name);
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (name) {
      params.set('user', name);
    }
    replace(`${pathname}?user=${name}&tab=${tabSelected}`);
  }, [name, pathname, replace, searchParams, tabSelected])

  useEffect(() => {
    const result = tabs.map((tab: Tab) => {
      if (tab.value === tabSelected) {
        return {
          ...tab,
          active: true
        }
      }
      return tab
    })
    console.log(result)
    setTabList(result)
  }, [tabSelected])

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-semibold text-3xl dark:text-gray-400">Home</h1>
          <p className="mt-1 dark:text-gray-400">Pesquise um usuário do github para obter suas informações.</p>
        </div>
        <Switch status={true} />
      </div>
      <Input 
        className="mt-4" 
        label="Buscar:" 
        placeholder="Faça sua busca aqui" 
        value={name}
        onChange={(value) => setName(value)}
      />
      <p className="mt-2 text-xs dark:text-gray-400">Sugestão de usuarios para teste:</p>
      <ul className="list-disc flex flex-col gap-1 mt-2">
        <li className="text-xs ml-6 flex gap-1 items-center dark:text-gray-400">- darcyclarke <Copy className="cursor-pointer hover:opacity-70" size={12} onClick={() => copyName('darcyclarke')} /></li>
        <li className="text-xs ml-6 flex gap-1 items-center dark:text-gray-400">- zenorocha <Copy className="cursor-pointer hover:opacity-70" size={12} onClick={() => copyName('zenorocha')} /></li>
      </ul>
      { data?.name 
        ?  <div className="mt-6 flex gap-12">
        <div className="w-[200px]">
          <img 
            className="rounded-md"
            src={data?.avatar_url} 
            width={240} 
          />
          <div className="mt-4 flex gap-2 flex-col">
            { data?.name ? <p className="font-bold text-xs dark:text-gray-400">{data?.name}</p> : null }
            { data?.login ? <p className="flex gap-1 text-xs items-center dark:text-gray-400"><User size={16} />{data?.login}</p> : null }
            { data?.company ? <p className="text-xs dark:text-gray-400">{data?.company}</p> : null }
            { data?.blog ? <Link href="www" className="flex gap-1 text-xs dark:text-gray-400"><Globe size={16} />{data?.blog}</Link> : null }
            { data?.location ? <p className="flex gap-1 text-xs dark:text-gray-400"><MapPin size={16} /> {data?.location}</p> : null }
            { data?.email ? <Link href="www" className="flex gap-1 text-xs dark:text-gray-400"><Mail size={16} />{data?.email}</Link> : null }
            <p className="text-xs my-4">{data?.bio}</p>
            <ul className="mb-4 flex flex-col gap-2">
              <li className="text-xs font-bold flex gap-1 dark:text-gray-400">{data?.public_repos}<span className="font-normal">Repositorios</span></li>
              <li className="text-xs font-bold flex gap-1 dark:text-gray-400">{data?.public_gists}<span className="font-normal">Gists</span></li>
              <li className="text-xs font-bold flex gap-1 dark:text-gray-400">{data?.followers}<span className="font-normal">Seguidores</span></li>
              <li className="text-xs font-bold flex gap-1 dark:text-gray-400">{data?.following}<span className="font-normal">Seguindo</span></li>
            </ul>
          </div>
        </div>
        <div className="w-full">
          <Tabs 
            data={tabList} 
            onClick={(value: Tab) => changeTabsSelected(value)} 
          />
          { tabSelected === 'repositories'
            ? <div className="mt-4">
                <div className={`flex pb-5 flex-wrap gap-4 ${dataRepositories && dataRepositories.length > 16 ? 'h-[calc(100vh_-300px)] overflow-y-scroll' : null}`}>
                  { dataRepositories && dataRepositories.length && dataRepositories.map((repo: any) => {
                    return (
                      <div key={repo.name} className="relative w-[300px] h-[145px] p-3 border rounded-md border-[#e5e7eb] shadow dark:text-gray-400">
                        <div className="flex justify-between">
                          <p className="text-xs font-bold uppercase">{repo.name}</p>
                          <p className="text-xs flex items-start">{format(repo.created_at, "MM/dd/yyyy")}</p>
                        </div>
                        <div className="my-4">
                          <p className="text-xs line-clamp-3">{repo.description ? repo.description : "Não tem descrição"}</p>
                        </div>
                        <div className="bottom-[10px] absolute">
                          <div className="flex gap-2">
                            <p className="flex gap-1 items-center">
                              <GitFork size={16} />
                              <span className="text-xs">{repo.forks}</span>
                            </p>
                            <p className="flex gap-1 items-center">
                              <Star size={16} />
                              <span className="text-xs">{repo.stargazers_count}</span>
                            </p>
                          </div>
                        </div>
                        <p className="flex absolute right-3 bottom-2">
                          <span className="text-xs">{repo.language}</span>
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            : null  
          }
          { tabSelected === 'followers'
            ? <div className="mt-4">
                <div className={`flex pb-5 flex-wrap gap-4 ${dataFollowers && dataFollowers.length > 16 ? 'h-[calc(100vh_-300px)] overflow-y-scroll' : null}`}>
                  { dataFollowers && dataFollowers.length && dataFollowers.map((follower: any) => {
                    return (
                      <div onClick={() => setName(follower.login)} key={follower.id} className="relative w-[300px] dark:text-gray-400 h-[145px] p-3 border rounded-md border-[#e5e7eb] shadow flex items-center gap-2">
                        <img 
                          className="rounded-md"
                          src={follower?.avatar_url} 
                          width={100}
                        /> 
                        <p className="text-xs font-bold text-center w-full">{follower.login}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            : null  
          }
          { tabSelected === 'following'
            ? <div className="mt-4">
                <div className={`flex pb-5 flex-wrap gap-4 ${dataFollowing && dataFollowing.length > 16 ? 'h-[calc(100vh_-300px)] overflow-y-scroll' : null}`}>
                  { dataFollowing && dataFollowing.length && dataFollowing.map((following: any) => {
                    return (
                      <div onClick={() => setName(following.login)} key={following.id} className="relative w-[300px] dark:text-gray-400 h-[145px] p-3 border rounded-md border-[#e5e7eb] shadow flex items-center gap-2">
                        <img 
                          className="rounded-md"
                          src={following?.avatar_url} 
                          width={100}
                        /> 
                        <p className="text-xs font-bold text-center w-full">{following.login}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            : null  
          }
        </div>
      </div>
      : null  
    }
    </div>
  );
}

export default Home