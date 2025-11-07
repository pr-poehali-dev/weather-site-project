import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  title: string;
  time: string;
  category: string;
  content: string;
  source: string;
  image?: string;
}

interface NewsModalProps {
  news: NewsItem;
  onClose: () => void;
  isDarkTheme: boolean;
}

const NewsModal = ({ news, onClose, isDarkTheme }: NewsModalProps) => {
  const cardBg = isDarkTheme ? 'bg-gray-900/95' : 'bg-white/95';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b backdrop-blur-xl bg-gradient-to-b from-inherit">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${isDarkTheme ? 'bg-white/10' : 'bg-gray-100'} rounded-xl`}>
              <Icon name="Newspaper" className={textColor} size={24} />
            </div>
            <div>
              <Badge className="bg-accent/80 text-white border-none mb-1 text-xs">
                {news.category}
              </Badge>
              <div className={`text-xs ${subtextColor} flex items-center gap-2`}>
                <Icon name="Clock" size={14} />
                {news.time}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-gray-100'} rounded-xl transition-all`}
          >
            <Icon name="X" className={textColor} size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {news.image && (
            <div className="w-full h-64 rounded-2xl overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h2 className={`text-3xl font-bold ${textColor} leading-tight`}>
            {news.title}
          </h2>

          <div className={`flex items-center gap-4 ${subtextColor} text-sm`}>
            <div className="flex items-center gap-2">
              <Icon name="User" size={16} />
              <span>{news.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              <span>{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div className={`${textColor} text-lg leading-relaxed space-y-4`}>
            {news.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className={`flex items-center gap-3 p-4 ${isDarkTheme ? 'bg-white/5' : 'bg-gray-50'} rounded-2xl`}>
            <Icon name="Info" size={20} className={subtextColor} />
            <p className={`text-sm ${subtextColor}`}>
              Информация основана на данных метеорологических служб и может быть уточнена
            </p>
          </div>
        </div>

        <div className={`p-6 border-t ${borderColor} flex justify-between items-center`}>
          <div className="flex gap-2">
            <button className={`p-3 ${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl transition-all`}>
              <Icon name="Share2" className={textColor} size={20} />
            </button>
            <button className={`p-3 ${isDarkTheme ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl transition-all`}>
              <Icon name="Bookmark" className={textColor} size={20} />
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
