import { Book } from './searcher';

interface TauriConfig {
  index_dir: string;
  ipfs_gateways: string[];
}

const DEFAULT_GATEWAY = 'https://cloudflare-ipfs.com';
const DEFAULT_GATEWAY_CHECKER = 'https://ipfs-checker.1kbtool.com';


export default async function getIpfsGateways() {
  if (import.meta.env.VITE_TAURI === '1') {
    const api = await import('@tauri-apps/api');
    return await api.invoke('get_config').then((conf) => {
      const config = conf as TauriConfig;
      return config.ipfs_gateways;
    });
  } else {
    const ipfsGateways: string[] = JSON.parse(localStorage.getItem('ipfs_gateways') || '[]');
    return ipfsGateways;
  }
}

export function parseIpfsGateways(text: string) {
  const gateways = text.split('\n').filter((g) => g.length > 0);
  return gateways.filter((g, i) => gateways.indexOf(g) === i);
}

export function getDownloadLinkFromIPFS(gateway: string, book: Book) {
   if (gateway === DEFAULT_GATEWAY_CHECKER) {
    // 如果选择了默认网关，就去掉/ipfs/路径
    return `${gateway}/${book.ipfs_cid}?filename=${encodeURIComponent(`${book.title}_${book.author}.${book.extension}`)}`;
  } else {
    return `${gateway}/ipfs/${book.ipfs_cid}?filename=${encodeURIComponent(`${book.title}_${book.author}.${book.extension}`)}`;
  }
}
