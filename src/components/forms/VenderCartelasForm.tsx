import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Minus } from 'lucide-react';
import { PedidoService } from '@/services/realPedidoService';
import { useToast } from '@/hooks/use-toast';
import type { Pedido } from '@/services/realPedidoService';

interface VenderCartelasFormProps {
  pedido: Pedido;
  onCartelasUpdated?: () => void;
}

export function VenderCartelasForm({ pedido, onCartelasUpdated }: VenderCartelasFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartelasSelecionadas, setCartelasSelecionadas] = useState<number[]>([]);
  const { toast } = useToast();

  // Cartelas disponíveis para venda = retiradas - vendidas - devolvidas
  const cartelasDisponiveis = pedido.cartelasRetiradas.filter(c => 
    !pedido.cartelasVendidas.includes(c) && !pedido.cartelasDevolvidas.includes(c)
  );

  const toggleCartela = (cartela: number) => {
    setCartelasSelecionadas(prev => 
      prev.includes(cartela) 
        ? prev.filter(c => c !== cartela)
        : [...prev, cartela].sort((a, b) => a - b)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartelasSelecionadas.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma cartela para vender",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      await PedidoService.venderCartelas(pedido.id, cartelasSelecionadas);

      toast({
        title: "Sucesso!",
        description: `${cartelasSelecionadas.length} cartela(s) vendida(s) com sucesso`
      });

      setCartelasSelecionadas([]);
      setOpen(false);
      onCartelasUpdated?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao vender cartelas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartelasDisponiveis.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled>
        <ShoppingCart size={16} />
        Sem Cartelas
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShoppingCart size={16} />
          Vender Cartelas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vender Cartelas</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {cartelasDisponiveis.length} cartela(s) disponível(is) para venda
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Cartelas Retiradas</div>
            <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto border rounded p-3">
              {cartelasDisponiveis.map(cartela => (
                <Badge
                  key={cartela}
                  variant={cartelasSelecionadas.includes(cartela) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => toggleCartela(cartela)}
                >
                  {cartela}
                </Badge>
              ))}
            </div>
          </div>

          {cartelasSelecionadas.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Selecionadas para Venda ({cartelasSelecionadas.length})</div>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto border rounded p-2 bg-muted/50">
                {cartelasSelecionadas.map(cartela => (
                  <Badge
                    key={cartela}
                    variant="default"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleCartela(cartela)}
                  >
                    {cartela} <Minus size={12} className="ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || cartelasSelecionadas.length === 0}
              className="flex-1"
            >
              {loading ? "Vendendo..." : `Vender ${cartelasSelecionadas.length} Cartela(s)`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}