# Phase 3 — Final architecture

```mermaid
flowchart TB
    subgraph ui [React UI]
        App[App.tsx]
        Hook[useCartObserver]
        Invoker[CommandInvoker]
    end

    subgraph behavioral [Behavioral]
        Engine[DiscountEngine]
        Strategies[DiscountStrategy classes]
        Observer[CartObserver]
        Commands[CartCommand]
    end

    subgraph structural [Structural]
        Decorators[Line Decorators]
        Adapter[LegacyPromoAdapter]
    end

    subgraph creational [Creational]
        Builder[CartBuilder]
        Factories[Product / Line Factories]
    end

    Cart[Cart]

    App --> Hook
    App --> Invoker
    Invoker --> Commands
    Commands --> Cart
    Hook --> Observer
    Cart --> Observer
    Cart --> Engine
    Engine --> Strategies
    Cart --> Decorators
    App --> Adapter
    Adapter --> Cart
    Builder --> Cart
    Cart --> Factories
```

## Pattern map (all phases)

| Phase | Patterns |
|-------|----------|
| 0 | None (naive) |
| 1 | Factory Method, Builder |
| 2 | Decorator, Adapter |
| 3 | Strategy, Observer, Command |
