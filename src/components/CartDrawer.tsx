import { type ChangeEvent, type FormEvent, useMemo, useRef } from 'react';
import type { Ship } from '../data/ships';
import { shipAvailabilityLabels } from '../constants/shipMeta';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';

export type DestinationHub = Readonly<{
  type: string;
  name: string;
}>;

export type CheckoutFormState = {
  destinationType: string;
  destinationName: string;
  recipient: string;
  comms: string;
  paymentMethod: string;
  deliverySlot: string;
  notes: string;
};

type CartDrawerProps = {
  cart: Ship[];
  cartTotal: number;
  checkoutForm: CheckoutFormState;
  destinationHubs: readonly DestinationHub[];
  availableDestinations: readonly DestinationHub[];
  paymentMethods: readonly string[];
  onClose: () => void;
  onRemoveFromCart: (id: string) => void;
  onSubmitCheckout: (event: FormEvent) => void;
  onCheckoutFieldChange: (
    field: keyof CheckoutFormState,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
};

export default function CartDrawer({
  cart,
  cartTotal,
  checkoutForm,
  destinationHubs,
  availableDestinations,
  paymentMethods,
  onClose,
  onRemoveFromCart,
  onSubmitCheckout,
  onCheckoutFieldChange,
}: CartDrawerProps) {
  const dialogRef = useRef<HTMLElement | null>(null);

  useDialogFocusTrap({
    isOpen: true,
    containerRef: dialogRef,
    onClose,
  });

  const destinationTypes = useMemo(() => Array.from(new Set(destinationHubs.map((hub) => hub.type))), [destinationHubs]);

  return (
    <div className="fixed inset-0 z-[76] bg-dark-navy/75 backdrop-blur-md" onClick={onClose} role="presentation">
      <aside
        ref={dialogRef}
        className="ml-auto h-full w-full max-w-[560px] overflow-y-auto border-l border-cyan-holo/25 bg-dark-navy/95 p-5 sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-describedby="cart-drawer-description"
        tabIndex={-1}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-holo">Checkout Dock</p>
            <h3 id="cart-drawer-title" className="mt-1 font-orbitron text-2xl uppercase text-text-light">
              Корзина и доставка
            </h3>
            <p id="cart-drawer-description" className="mt-1 font-rajdhani text-sm text-text-light/65">
              Проверьте состав заказа, заполните контакт и подтвердите оформление.
            </p>
          </div>
          <button
            type="button"
            className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
            onClick={onClose}
            aria-label="Закрыть корзину"
          >
            Закрыть
          </button>
        </div>

        <div className="panel-shell p-4">
          <div className="flex items-center justify-between">
            <p className="font-orbitron text-sm uppercase tracking-[0.12em] text-amber-ui">Текущие позиции</p>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-light/60">{cart.length} шт</p>
          </div>
          {cart.length === 0 ? (
            <p className="mt-3 font-rajdhani text-base text-text-light/65">Корзина пустая. Добавьте корабли из каталога.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="rounded-lg border border-cyan-holo/20 bg-dark-navy/45 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-rajdhani text-lg text-text-light">{item.name}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-text-light/50">
                        {shipAvailabilityLabels[item.availability]}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="rounded border border-amber-ui/45 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-ui"
                      onClick={() => onRemoveFromCart(item.id)}
                      aria-label={`Удалить ${item.name} из корзины`}
                    >
                      Удалить
                    </button>
                  </div>
                  <p className="mt-2 font-orbitron text-xl text-amber-ui">${(item.priceUsd / 1000).toFixed(0)}K</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-cyan-holo/20 pt-3">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-light/55">Итого</p>
            <p className="font-orbitron text-2xl text-amber-ui">${(cartTotal / 1000).toFixed(0)}K</p>
          </div>
        </div>

        <form className="mt-5 space-y-4" onSubmit={onSubmitCheckout}>
          <div className="panel-shell p-4">
            <p className="font-orbitron text-sm uppercase tracking-[0.12em] text-cyan-holo">Куда доставить</p>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <label className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-light/60">Тип хаба</span>
                <select
                  value={checkoutForm.destinationType}
                  onChange={onCheckoutFieldChange('destinationType')}
                  className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light focus:border-amber-ui/55 focus:outline-none"
                >
                  {destinationTypes.map((type) => (
                    <option key={type} value={type} className="bg-panel-dark text-text-light">
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-light/60">Площадка передачи</span>
                <select
                  value={checkoutForm.destinationName}
                  onChange={onCheckoutFieldChange('destinationName')}
                  className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light focus:border-amber-ui/55 focus:outline-none"
                >
                  {availableDestinations.map((hub) => (
                    <option key={hub.name} value={hub.name} className="bg-panel-dark text-text-light">
                      {hub.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-light/60">Окно доставки</span>
                <select
                  value={checkoutForm.deliverySlot}
                  onChange={onCheckoutFieldChange('deliverySlot')}
                  className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light focus:border-amber-ui/55 focus:outline-none"
                >
                  <option value="Ближайшее окно">Ближайшее окно</option>
                  <option value="Премиум быстрый коридор">Премиум быстрый коридор</option>
                  <option value="Ночная скрытая поставка">Ночная скрытая поставка</option>
                </select>
              </label>
            </div>
          </div>

          <div className="panel-shell p-4">
            <p className="font-orbitron text-sm uppercase tracking-[0.12em] text-cyan-holo">Оплата и контакт</p>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <label className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-light/60">Метод оплаты</span>
                <select
                  value={checkoutForm.paymentMethod}
                  onChange={onCheckoutFieldChange('paymentMethod')}
                  className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light focus:border-amber-ui/55 focus:outline-none"
                >
                  {paymentMethods.map((method) => (
                    <option key={method} value={method} className="bg-panel-dark text-text-light">
                      {method}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-light/60">Получатель</span>
                <input
                  value={checkoutForm.recipient}
                  onChange={onCheckoutFieldChange('recipient')}
                  placeholder="Получатель / капитан экипажа"
                  className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light placeholder:text-text-light/35 focus:border-amber-ui/55 focus:outline-none"
                />
              </label>

              <label className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-light/60">Канал связи</span>
                <input
                  value={checkoutForm.comms}
                  onChange={onCheckoutFieldChange('comms')}
                  placeholder="Контактный канал (dock-id, comm-link)"
                  className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light placeholder:text-text-light/35 focus:border-amber-ui/55 focus:outline-none"
                />
              </label>

              <label className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-light/60">Комментарий</span>
                <textarea
                  rows={3}
                  value={checkoutForm.notes}
                  onChange={onCheckoutFieldChange('notes')}
                  placeholder="Комментарий к доставке и передаче корабля"
                  className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light placeholder:text-text-light/35 focus:border-amber-ui/55 focus:outline-none"
                />
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={cart.length === 0}>
            ОФОРМИТЬ ДОСТАВКУ И ОПЛАТУ
          </button>
        </form>
      </aside>
    </div>
  );
}
