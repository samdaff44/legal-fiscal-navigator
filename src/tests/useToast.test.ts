
/**
 * Tests unitaires pour le hook useToast
 */

import { renderHook, act } from '@testing-library/react-hooks';
import { useToast, toast, reducer } from '@/hooks/use-toast';
import '@types/jest';

describe('useToast Hook', () => {
  test('useToast devrait retourner l\'état initial', () => {
    const { result } = renderHook(() => useToast());
    
    expect(result.current.toasts).toEqual([]);
    expect(typeof result.current.toast).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });
  
  test('toast devrait créer un nouveau toast', () => {
    // Utilise toast directement
    const toastResult = toast({
      title: 'Test',
      description: 'Description du test',
      variant: 'default',
    });
    
    // Vérifie le résultat
    expect(toastResult).toHaveProperty('id');
    expect(toastResult).toHaveProperty('dismiss');
    expect(toastResult).toHaveProperty('update');
    
    // Vérifie via le hook
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Test');
  });
  
  test('dismiss devrait supprimer un toast', () => {
    // Crée un toast
    const toastResult = toast({
      title: 'Test',
      description: 'Description du test',
    });
    
    // Vérifie qu'il existe
    let hookResult = renderHook(() => useToast()).result;
    expect(hookResult.current.toasts.length).toBe(1);
    
    // Supprime le toast
    act(() => {
      hookResult.current.dismiss(toastResult.id);
    });
    
    // Le toast devrait être marqué comme fermé
    hookResult = renderHook(() => useToast()).result;
    expect(hookResult.current.toasts[0].open).toBe(false);
  });
  
  test('le reducer devrait ajouter correctement un toast', () => {
    const initialState = { toasts: [] };
    const newToast = {
      id: '1',
      title: 'Test',
      description: 'Test description',
      open: true,
    };
    
    const newState = reducer(initialState, {
      type: 'ADD_TOAST',
      toast: newToast,
    });
    
    expect(newState.toasts.length).toBe(1);
    expect(newState.toasts[0]).toEqual(newToast);
  });
  
  test('le reducer devrait mettre à jour correctement un toast', () => {
    const initialToast = {
      id: '1',
      title: 'Test',
      description: 'Test description',
      open: true,
    };
    const initialState = { toasts: [initialToast] };
    
    const updatedToast = {
      id: '1',
      title: 'Updated',
    };
    
    const newState = reducer(initialState, {
      type: 'UPDATE_TOAST',
      toast: updatedToast,
    });
    
    expect(newState.toasts.length).toBe(1);
    expect(newState.toasts[0].title).toBe('Updated');
    expect(newState.toasts[0].description).toBe('Test description');
  });
});
