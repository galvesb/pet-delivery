interface Props {
  shown: number;
  total: number;
  loading: boolean;
  onLoadMore: () => void;
}

export function LoadMoreButton({ shown, total, loading, onLoadMore }: Props) {
  return (
    <div className="load-more">
      <span className="load-more-count">
        Mostrando {shown} de {total} produtos
      </span>
      {shown < total && (
        <button
          type="button"
          className="btn"
          onClick={onLoadMore}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </div>
  );
}
