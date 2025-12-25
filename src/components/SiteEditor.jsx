import { useState, useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

const SiteEditor = ({ initialData = [] }) => {
  // 核心状态：管理整个 JSON 数据
  const [data, setData] = useState(JSON.parse(JSON.stringify(initialData)));
  // 引用：用于模态框操作时定位当前的分类和索引
  const [activeRef, setActiveRef] = useState({ catIdx: 0, siteIdx: 0 });
  const modalRef = useRef(null);

  // 初始化拖拽逻辑
  useEffect(() => {
    data.forEach((_, catIdx) => {
      const el = document.getElementById(`tbody-${catIdx}`);
      Sortable.create(el, {
        handle: '.cursor-move',
        animation: 250,
        onEnd: (evt) => {
          const newData = [...data];
          const sites = newData[catIdx].sites;
          const [movedItem] = sites.splice(evt.oldIndex, 1);
          sites.splice(evt.newIndex, 0, movedItem);
          setData(newData); // 更新状态触发重新渲染
        },
      });
    });
  }, [data.length]); // 当分类数量变化时重新绑定

  // 通用输入框更新逻辑
  const updateSite = (catIdx, siteIdx, key, value) => {
    const newData = [...data];
    newData[catIdx].sites[siteIdx][key] = value;
    setData(newData);
  };

  // 添加站点
  const addSite = (catIdx) => {
    const newData = [...data];
    newData[catIdx].sites.push({ name: '', url: '', description: '', image: '' });
    setData(newData);
  };

  // 删除站点
  const deleteSite = (catIdx, siteIdx) => {
    if (!window.confirm('确定删除吗？')) return;
    const newData = [...data];
    newData[catIdx].sites.splice(siteIdx, 1);
    setData(newData);
  };

  // 打开图标模态框
  const openIconModal = (catIdx, siteIdx) => {
    setActiveRef({ catIdx, siteIdx });
    modalRef.current.showModal();
  };

  // 应用图标修改
  const applyIconChange = (type) => {
    const { catIdx, siteIdx } = activeRef;
    const site = data[catIdx].sites[siteIdx];
    let newImg = '';

    try {
      if (!site.url && type !== 'manual') throw new Error('请先填写 URL');
      const urlObj = new URL(site.url.startsWith('http') ? site.url : 'https://' + site.url);

      if (type === 'favicon') newImg = `${urlObj.origin}/favicon.ico`;
      if (type === 'api') newImg = `https://ico.kucat.cn/get.php?url=${urlObj.href}`;
      if (type === 'manual') newImg = prompt('请输入图标 URL:', site.image || '');

      if (newImg) {
        updateSite(catIdx, siteIdx, 'image', newImg);
        modalRef.current.close();
      }
    } catch (e) {
      alert(e.message || '网址无效');
    }
  };

  return (
    <div className="mt-10 min-h-screen p-4 md:p-12 bg-base-200 rounded-3xl text-base-content font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300">
          <div>
            <h2 className="text-2xl font-bold text-primary italic">Site Editor</h2>
            <p className="text-sm opacity-60">数据驱动 · 实时预览 · 拖拽排序</p>
          </div>
          <button
            className="btn btn-primary px-8"
            onClick={() => console.log(JSON.stringify(data, null, 2))}
          >
            导出 JSON 到控制台
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {data.map((category, catIdx) => (
            <details key={catIdx} open className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-xl overflow-visible">
              <summary className="collapse-title text-lg font-bold flex items-center gap-3">
                <span className="badge badge-primary badge-outline">{category.sites.length}</span>
                {category.name}
              </summary>
              <div className="collapse-content overflow-visible px-4 pb-4">
                <div className="overflow-x-auto overflow-y-visible">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr className="opacity-50 border-b">
                        <th className="w-8"></th>
                        <th className="w-12">#</th>
                        <th>名称</th>
                        <th>URL</th>
                        <th className="w-16 text-center">图标</th>
                        <th>描述</th>
                        <th className="w-20 text-center text-error">操作</th>
                      </tr>
                    </thead>
                    <tbody id={`tbody-${catIdx}`}>
                      {category.sites.map((site, siteIdx) => (
                        <tr key={siteIdx} className="hover:bg-base-200/50 group">
                          <td className="cursor-move text-base-300 hover:text-primary">⠿</td>
                          <th className="opacity-30 font-mono text-xs">{siteIdx + 1}</th>
                          <td>
                            <input
                              type="text"
                              className="input input-ghost input-sm w-full focus:bg-base-100"
                              value={site.name}
                              onChange={(e) => updateSite(catIdx, siteIdx, 'name', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input input-ghost input-sm w-full text-primary focus:bg-base-100"
                              value={site.url}
                              onChange={(e) => updateSite(catIdx, siteIdx, 'url', e.target.value)}
                            />
                          </td>
                          <td className="flex justify-center">
                            <button
                              className="btn btn-ghost btn-circle btn-sm border border-base-300"
                              onClick={() => openIconModal(catIdx, siteIdx)}
                            >
                              <div className="w-7 rounded bg-white overflow-hidden p-0.5">
                                <img src={site.image || '/favicon.ico'} className="object-contain w-full h-full" alt="" />
                              </div>
                            </button>
                          </td>
                          <td>
                            <input
                              type="text"
                              className="input input-ghost input-sm w-full opacity-70 focus:bg-base-100"
                              value={site.description || ''}
                              onChange={(e) => updateSite(catIdx, siteIdx, 'description', e.target.value)}
                            />
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => deleteSite(catIdx, siteIdx)}
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="btn btn-dashed btn-sm w-full mt-4 text-primary/70" onClick={() => addSite(catIdx)}>
                  + 添加新站点
                </button>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Global Modal */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box border border-base-300">
          <h3 className="font-bold text-lg">更换站点图标</h3>
          <div className="grid grid-cols-1 gap-3 py-4">
            <button className="btn btn-outline justify-start gap-4" onClick={() => applyIconChange('favicon')}>🌐 域名 Favicon</button>
            <button className="btn btn-outline justify-start gap-4" onClick={() => applyIconChange('api')}>✨ 智能 API (Kucat)</button>
            <button className="btn btn-outline justify-start gap-4" onClick={() => applyIconChange('manual')}>📝 手动输入地址</button>
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => modalRef.current.close()}>取消</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-sm">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default SiteEditor;