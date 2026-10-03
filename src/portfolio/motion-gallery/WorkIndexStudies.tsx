import { useRef, useState, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PROJECTS, type Project } from '../../data/projects';
import Icon from '../Icon';
import MotionLink from './MotionLink';
import { WorkIndexCard } from './WorkIndexCards';
import { GALLERY_PATH } from './data';
import useEditionMotion from './useEditionMotion';
import './work-index-studies.css';

const studyProjects = ['mbbank-priority', 'lavie-tvc-2025', 'rong-do-gducke-mv', 'grab-dejavu', 'nuvi-mv', 'heineken-tvc-2023']
  .map(id => PROJECTS.find(project => project.id === id))
  .filter((project): project is Project => Boolean(project));

const directions = [
  { id: 'a', label: 'A', title: 'Editorial Cuts', detail: 'Một khung chủ đạo, các job còn lại xếp như trang tạp chí. Có điểm nhấn lớn, nhưng bố cục vẫn gọn để mở rộng archive.', signature: 'Khung chủ đạo / Lưới biên tập', motion: 'Hover nâng khung nhẹ, ảnh tiến gần rất chậm.' },
  { id: 'b', label: 'B', title: 'Frame Editions', detail: 'Card dạng bản in hai lớp, lấy tinh thần từ ba card Breakdown anh đã thích. Rê chuột để hé thêm một frame thuộc chính job đó.', signature: 'Bản in hai lớp / Gần style hiện tại nhất', motion: 'Card đi theo chuột nhẹ, lớp ảnh phía sau mở chậm và thả về êm.' },
  { id: 'c', label: 'C', title: 'Cinema Ledger', detail: 'Khung điện ảnh với cạnh đánh số lớn, ảnh rộng và nền đen. Ít trang trí hơn, nhấn vào footage và cảm giác làm phim.', signature: 'Khung phim / Số thứ tự lớn', motion: 'Hover dịch ảnh nhẹ trong khung, nút mở chuyển hướng mềm.' },
] as const;

type Direction = typeof directions[number]['id'];

export default function WorkIndexStudies() {
  const [parameters, setParameters] = useSearchParams();
  const selected = directions.find(direction => direction.id === parameters.get('direction')) ?? directions[1];
  const [hovered, setHovered] = useState<string | null>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const grid = useRef<HTMLDivElement>(null);
  useEditionMotion(grid, selected.id, 'studies');
  const change = (direction: Direction) => {
    setHovered(null);
    setParameters({ direction }, { replace: true, preventScrollReset: true });
  };
  const moveTab = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % directions.length;
    else if (event.key === 'ArrowLeft') next = (index + directions.length - 1) % directions.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = directions.length - 1;
    else return;
    event.preventDefault(); change(directions[next].id); tabs.current[next]?.focus();
  };

  return <main id="main-content" className="mg-page ws-studies" tabIndex={-1}>
    <div className="ws-study-top mg-shell"><span>Card studies / Three directions</span><MotionLink to={GALLERY_PATH + '#archive'}>Bản hiện tại <Icon name="arrow" /></MotionLink></div>
    <section className="ws-study-section mg-shell" aria-labelledby="mg-page-title">
      <div className="ws-study-heading"><div><p className="mg-small-label">Hai Luong / The project archive</p><h1 id="mg-page-title" className="mg-display" tabIndex={-1}>WORK <span className="mg-outline">INDEX.</span></h1></div><p>Ba hướng thiết kế cho phần card.<br />Ba lựa chọn đã có trên Work Index.</p></div>
      <div className="ws-switcher" role="tablist" aria-label="Các phương án thiết kế card">
        {directions.map((direction, index) => <button key={direction.id} ref={node => { tabs.current[index] = node; }} role="tab" id={'ws-tab-' + direction.id} aria-selected={selected.id === direction.id} aria-controls="ws-study-panel" tabIndex={selected.id === direction.id ? 0 : -1} onKeyDown={event => moveTab(event, index)} onClick={() => change(direction.id)}>
          <span className="ws-option-letter">{direction.label}</span><span className="ws-option-name">{direction.title}<small>{direction.id === 'b' ? 'Gần style hiện tại nhất' : direction.id === 'a' ? 'Bố cục có điểm nhấn' : 'Điện ảnh & tối giản'}</small></span><Icon name="arrow" />
        </button>)}
      </div>
      <div className="ws-direction-note"><div><span>Direction {selected.label} / {selected.signature}</span><p>{selected.detail}</p></div><p className="ws-motion-note"><span>Interaction</span>{selected.motion}</p></div>
      <div className="ws-study-counter"><span>06 / 06 sample projects</span><span>Cùng sáu job trong cả ba demo</span></div>
      <div ref={grid} key={selected.id} id="ws-study-panel" className={'ws-panel ws-card-grid ws-grid-' + selected.id} role="tabpanel" aria-labelledby={'ws-tab-' + selected.id} tabIndex={0}>
        {studyProjects.map((project, index) => <WorkIndexCard key={project.id} project={project} index={index} direction={selected.id} eager={index < 3} active={hovered === project.id} onActiveChange={setHovered} />)}
      </div>
      <div className="ws-study-bottom"><p>Demo dùng sáu job để so sánh thẩm mỹ và tương tác.<br />Tìm kiếm, bộ lọc và đủ 44 dự án đã có trên Work Index.</p><MotionLink to={GALLERY_PATH + '#archive'}>So sánh với bản hiện tại <Icon name="arrow" /></MotionLink></div>
    </section>
    <footer className="ws-study-footer mg-shell"><span>Hai Luong / Design studies</span><span>Logo, Breakdown và dữ liệu job gốc giữ nguyên.</span></footer>
  </main>;
}
